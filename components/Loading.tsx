import Image from "next/image";

export default function LoadingIcon({ width = 40, height = 40 }) {
  return (
    <div className="flex justify-center items-center">
      <Image
        src="/images/icon/loading.svg" // public 폴더 기준 경로
        alt=""
        width={width}
        height={height}
        className="animate-spin-slow"
      />
    </div>
  );
}
