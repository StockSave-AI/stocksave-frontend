import hero from "../../assets/hero-main.png";
import onion from "../../assets/onion.png";
import plant from "../../assets/plant.png";

function HeroImageLayout() {
  return (
    <section className="py-10 lg:pt-15">
      <div className="grid  gap-4 grid-cols-[3fr_2fr]">
        <div className="row-span-2 h-auto lg:h-[450px]">
          <img
            src={hero}
            alt="Main dashboard preview"
            className="rounded-card object-cover w-full h-full"
          />
        </div>

        <div className="h-auto lg:h-[220px]">
          <img
            src={onion}
            alt="Onion inventory preview"
            className="rounded-card object-cover w-full h-full"
          />
        </div>

        <div className="h-auto lg:h-[210px]">
          <img
            src={plant}
            alt="Plant inventory preview"
            className="rounded-card object-fit w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroImageLayout;
