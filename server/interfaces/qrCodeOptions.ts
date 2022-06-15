export default interface QRCodeOptions {
  margin: number;
  image: string;
  imageOptions: {
    hideBackgroundDots: boolean;
    imageSize: number;
    margin: number;
    crossOrigin: string;
  };
  dotsOptions: {
    type: string;
    color: string;
  };
  backgroundOptions: {
    color: string;
  };
  cornersSquareOptions: {
    type: string;
    color: string;
  };
  cornersDotOptions: {
    type: string;
    color: string;
  };
}

export const QR_CODE_OPTIONS_DEFAULTS = {
  margin: 0,
  image: "",
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 0,
    crossOrigin: "anonymous",
  },
  dotsOptions: {
    type: "square",
    color: "#040404",
  },
  backgroundOptions: {
    color: "#fff",
  },
  cornersSquareOptions: {
    type: "square",
    color: "#040404",
  },
  cornersDotOptions: {
    type: "square",
    color: "#040404",
  },
};

export function isQrCodeOptions(obj: any): boolean {
  if (typeof obj !== "object") return false;

  return (
    "margin" in obj &&
    "image" in obj &&
    "imageOptions" in obj &&
    "hideBackgroundDots" in obj.imageOptions &&
    "imageSize" in obj.imageOptions &&
    "margin" in obj.imageOptions &&
    "crossOrigin" in obj.imageOptions &&
    "dotsOptions" in obj &&
    "type" in obj.dotsOptions &&
    "color" in obj.dotsOptions &&
    "backgroundOptions" in obj &&
    "color" in obj.backgroundOptions &&
    "cornersSquareOptions" in obj &&
    "type" in obj.cornersSquareOptions &&
    "color" in obj.cornersSquareOptions &&
    "cornersDotOptions" in obj &&
    "type" in obj.cornersDotOptions &&
    "color" in obj.cornersDotOptions
  );
}
