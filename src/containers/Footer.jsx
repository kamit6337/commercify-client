const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <div className="h-full w-full flex justify-center items-center relative">
      <div className="text-center">
        <p className="text-3xl">Commercify</p>
        <p className="text-xs mt-2">an E-Commerce Web App</p>
      </div>
      <p className="absolute text-xs bottom-0 mb-2">
        Copyright of Amit Kumar, &copy; {year}
      </p>
    </div>
  );
};

export default Footer;
