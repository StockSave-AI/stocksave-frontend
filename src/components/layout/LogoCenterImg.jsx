import logo from "../../assets/stocksavelogo.png";
function LogoCenterImg() {
  return (
    <div className="w-16 h-16 mx-auto text-white rounded-lg flex items-center justify-center text-lg font-semibold shadow-md">
      <img src={logo} />
    </div>
  );
}

export default LogoCenterImg;
