import Icon from "@components/Icon";
import { GET_CLOUDINARY_SIGNATURE_URL } from "@definitions/apiEndpoints";
import { useCustomSnackbar } from "@hooks/useCustomSnackbar";
import { useAppSelector } from "@redux/store";
import axios, { AxiosResponse } from "axios";
import React, { useState, ChangeEvent } from "react";
import styled from "styled-components";

const IMAGE_SIZE = 250;

const StyledImageContainer = styled.div`
  width: ${IMAGE_SIZE}px;
  height: ${IMAGE_SIZE}px;
  background-color: lightgray;
`;

const ChangeImageContainer = styled.div`
  display: none;
  transition: all 0.3s ease-in-out;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;

  ${StyledImageContainer}:hover & {
    display: flex;
    background-color: rgba(0, 0, 0, 0.5);
  }
`;

export const ImageUploader = ({
  onChange,
  initialUrl,
  isBusiness,
}: {
  onChange(url: string): void;
  initialUrl?: string;
  isBusiness?: boolean;
}) => {
  const [currentImage, setCurrentImage] = useState(initialUrl || "");
  const [isLoading, setIsLoading] = useState(false);

  const openSnackbar = useCustomSnackbar();

  const firstName = useAppSelector((state) => state.account.firstName);
  const lastName = useAppSelector((state) => state.account.lastName);

  async function handleImageChange(event: ChangeEvent) {
    if (
      (event.target as HTMLInputElement).files &&
      (event.target as HTMLInputElement).files.length
    ) {
      if (setIsLoading) {
        setIsLoading(true);
      }
      const file = (event.target as HTMLInputElement).files[0];

      const formData = new FormData();
      formData.append("file", file);

      let signatureResponse: AxiosResponse;

      try {
        signatureResponse = await axios.get(GET_CLOUDINARY_SIGNATURE_URL);
      } catch (err) {
        openSnackbar(
          "Error when uploading image, please try again.",
          "warning",
        );
        if (setIsLoading) {
          setIsLoading(false);
        }
        return;
      }

      const { signature, timestamp } = signatureResponse.data;

      const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

      let uploadResponse: AxiosResponse;

      try {
        uploadResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload?api_key=${API_KEY}&timestamp=${timestamp}&signature=${signature}`,
          formData,
        );
      } catch (err) {
        openSnackbar(
          "Error when uploading image, please try again.",
          "warning",
        );
        if (setIsLoading) {
          setIsLoading(false);
        }
        return;
      }

      let imageUrl = uploadResponse.data.secure_url;
      onChange(imageUrl);
      setCurrentImage(imageUrl);
      if (setIsLoading) {
        setIsLoading(false);
      }
    }
  }

  return (
    <div>
      <label htmlFor="avatar">
        <StyledImageContainer
          className={`relative rounded-full overflow-hidden flex justify-center items-center shadow-md ${
            !isLoading && "cursor-pointer"
          }`}
        >
          {currentImage && currentImage.length > 0 ? (
            <img
              src={currentImage}
              alt="avatar"
              style={{
                objectFit: "cover",
              }}
            />
          ) : (
            <div className="flex-1 flex justify-center items-center">
              {isBusiness ? (
                <div>
                  <h2>Logo</h2>
                </div>
              ) : (
                <div>
                  <h2>{`${firstName.slice(0, 1)}${lastName.slice(0, 1)}`}</h2>
                </div>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-20">
              <Icon name="loading" width={48} height={48} color="#ffffff" />
            </div>
          ) : (
            <ChangeImageContainer className="absolute top-0 left-0 right-0 bottom-0">
              <h3>
                CHANGE
                <br />
                IMAGE
              </h3>
            </ChangeImageContainer>
          )}
        </StyledImageContainer>
      </label>
      <input
        type="file"
        id="avatar"
        style={{ display: "none" }}
        onChange={handleImageChange}
        disabled={isLoading}
      />
    </div>
  );
};
