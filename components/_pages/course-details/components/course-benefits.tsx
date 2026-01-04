const benefits = [
  {
    title: "Get unlimited access to every class",
  },
  {
    title: "Taught by industry leaders & working professionals",
  },
  {
    title: "Topics that are relevant & in-demand",
  },
];

const CourseBenefits = () => {
  return (
    <section className="bg-[#F0F0F0]  relative z-0 px-4 md:px-10 lg:px-24">
      <div className="container py-8 mx-auto">
        <h2 className="text-lg md:text-xl lg:text-start text-center font-semibold text-secondary mb-6">
          Watch this class and thousands more
        </h2>

        <div className="flex flex-wrap gap-6 md:justify-start">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3 max-w-[320px]">
              <div className="w-1 h-full min-h-[20px] bg-primary rounded-full" />
              <p className="text-black">{benefit.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseBenefits;
