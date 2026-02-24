import { FaNairaSign } from "react-icons/fa6";

const Header = () => {
  return (
    <header className="bg-secondary-700 text-white p-6 rounded-card flex justify-between items-center shadow-card">
      <div>
        <h1 className="text-h2 md:text-h1">Record Cash Deposit</h1>
        <p className="text-secondary-100 text-sm md:text-base">
          Manually add cash received from customers
        </p>
      </div>
      <div className="bg-white/20 p-3 rounded-full">
        <FaNairaSign size={24} />
      </div>
    </header>
  );
};

export default Header;
