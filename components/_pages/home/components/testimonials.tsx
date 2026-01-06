import { Star } from "lucide-react";
import Image from "next/image";
import teacherImage1 from "../assets/placeholder-person.jpg";
import teacherImage2 from "../assets/placeholder-person2.jpg";
import teacherImageLong from "../assets/placeholder-person3.jpg";
import quotesSvg from "../assets/quotes.svg";
import useTranslation from "next-translate/useTranslation";

export function Testimonials() {
  const { t } = useTranslation("home");

  const featuredTestimonials = [
    {
      name: t("homeTestimonialsFeatured1Name"),
      role: t("homeTestimonialsFeatured1Role"),
      image: teacherImageLong,
      quote: t("homeTestimonialsFeatured1Quote"),
      hasVideo: true,
    },
    {
      name: t("homeTestimonialsFeatured2Name"),
      role: t("homeTestimonialsFeatured2Role"),
      image: teacherImage1,
      quote: t("homeTestimonialsFeatured2Quote"),
      hasVideo: false,
    },
    {
      name: t("homeTestimonialsFeatured3Name"),
      role: t("homeTestimonialsFeatured3Role"),
      image: teacherImage2,
      quote: t("homeTestimonialsFeatured3Quote"),
      hasVideo: false,
    },
  ];

  const reviews = [
    {
      name: t("homeTestimonialsReview1Name"),
      role: t("homeTestimonialsReview1Role"),
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      quote: t("homeTestimonialsReview1Quote"),
    },
    {
      name: t("homeTestimonialsReview2Name"),
      role: t("homeTestimonialsReview2Role"),
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      quote: t("homeTestimonialsReview2Quote"),
    },
    {
      name: t("homeTestimonialsReview3Name"),
      role: t("homeTestimonialsReview3Role"),
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      quote: t("homeTestimonialsReview3Quote"),
    },
  ];

  return (
    <section className="py-16 px-6 md:px-10 lg:px-24 ">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium mb-4">
          {t("homeTestimonialsHeadingPrefix")}{" "}
          <span className="text-primary">
            {t("homeTestimonialsHeadingHighlight")}
          </span>{" "}
          {t("homeTestimonialsHeadingSuffix")}
        </h2>
        <p className="text-black text-sm sm:text-base md:text-lg">
          {t("homeTestimonialsSubtitle")}
        </p>
      </div>

      {/* Featured Testimonials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-6 bg-transparent">
        {featuredTestimonials.map((testimonial, index) => (
          <div
            key={index}
            className={
              index === 0
                ? "relative group bg-white border border-[#DEE0ED] p-3 rounded-3xl xl:col-span-2"
                : index === 2
                ? "relative group bg-white border border-[#DEE0ED] p-3 rounded-3xl sm:hidden md:block"
                : "relative group bg-white border border-[#DEE0ED] p-3 rounded-3xl"
            }
          >
            <div
              className={
                "relative rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-auto lg:h-[420px]"
              }
            >
              <Image
                src={testimonial.image || "/placeholder.svg"}
                alt={testimonial.name}
                fill
                className="object-cover"
              />

              {/* Quote Overlay */}
              {testimonial.quote && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                  <p className="text-white text-[10px] sm:text-sm font-medium">
                    {testimonial.quote}
                  </p>
                </div>
              )}
            </div>

            {/* Name and Role */}
            <div className="mt-3 flex items-start justify-between pt-1 ps-2">
              <div>
                <h3 className="font-semibold text-foreground">
                  {testimonial.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
              <Image
                src={quotesSvg}
                alt=""
                width={32}
                height={32}
                className="h-14 w-14"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ">
        {reviews.map((review, index) => (
          <div
            key={index}
            className={
              index === 2
                ? "bg-white border border-[#DEE0ED] p-8 rounded-3xl md:hidden xl:block"
                : "bg-white border border-[#DEE0ED] p-8 rounded-3xl"
            }
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 max-[450px]:flex-col max-[450px]:items-start max-[450px]:gap-3 max-[450px]:justify-start">
              <div className="flex items-center gap-3">
                <Image
                  src={review.avatar || "/placeholder.svg"}
                  alt={review.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-foreground text-xs">
                    {review.name}
                  </h4>
                  <p className="text-[10px] text-muted-foreground">
                    {review.role}
                  </p>
                </div>
              </div>
              <div className="flex gap-0.5 max-[450px]:ps-[60px]">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#E1E4EB]/50 my-5 border-2" />

            {/* Quote */}
            <p className="text-[#52597A] text-xs ">{review.quote}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
