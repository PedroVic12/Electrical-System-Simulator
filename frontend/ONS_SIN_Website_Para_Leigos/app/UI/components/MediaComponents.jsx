export function ImgContainer({ src, alt, className = "", ...props }) {
  const imagePath = src.startsWith('/') ? src : `/${src}`;
  return (
    <div className={`relative w-full ${className}`}>
      <img
        src={imagePath}
        alt={alt || "Image"}
        className="w-full h-auto object-contain"
        loading="lazy"
        {...props}
      />
      <p className="text-[9px] text-center">{alt}</p>
    </div>
  );
}

export function VideoContainer({
  path_video,
  width = "500px",
  height = "300px",
  objectFit = "cover",
  className = "",
  ...props
}) {
  return (
    <video
      className={className}
      style={{
        width: width,
        height: height,
        objectFit: objectFit,
        display: 'block'
      }}
      autoPlay
      loop
      muted
      playsInline
      {...props}
    >
      <source src={path_video} type="video/mp4" />
    </video>
  );
}

export function FlowArrow() {
  return (
    <>
      <div className="flow-arrow hidden md:block mx-4">→</div>
      <div className="flow-arrow block md:hidden my-2">↓</div>
    </>
  )
}
