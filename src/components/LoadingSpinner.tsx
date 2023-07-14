export default function LoadingSpinner(props: {
  height: number;
  width: number;
}) {
  return (
    <>
      <picture className="animate-spin-reverse ml-4">
        <source srcSet="/WhiteLogo.png" media="(prefers-color-scheme: dark)" />
        <img
          src="/BlackLogo.png"
          alt="logo"
          width={props.width}
          height={props.height}
        />
      </picture>
    </>
  );
}
