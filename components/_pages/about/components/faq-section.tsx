"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do I need any prior experience in e-commerce?",
    answer:
      "No, this course is perfect for beginners. It starts from the basics and gradually moves into advanced topics such as product selection, pricing, marketing, and store management.",
  },
  {
    question: "What is the Amazon FBA Course?",
    answer:
      "The Amazon FBA Course is a comprehensive training program designed to teach you how to build and scale a successful Amazon FBA business from scratch.",
  },
  {
    question: "Will I receive a certificate after completing the course?",
    answer:
      "Yes, upon successful completion of the course, you will receive a certificate that you can add to your professional portfolio and LinkedIn profile.",
  },
  {
    question: "How long does the course take, and when can I start?",
    answer:
      "The course is self-paced, so you can start immediately after enrollment and complete it at your own speed. Most students finish within 4-8 weeks.",
  },
  {
    question: "Can I apply what I learn right away?",
    answer:
      "The course is designed with practical, actionable steps that you can implement immediately to start building your e-commerce business.",
  },
];

export function FAQSection() {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl">
            <span className="font-sans text-foreground">Frequently </span>
            <span className="font-serif italic text-teal-700">Ask</span>
          </h2>
          <h2 className="font-serif italic text-teal-700 text-3xl md:text-4xl">
            Questions
          </h2>
        </div>

        {/* FAQ Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <Accordion
            type="single"
            collapsible
            className="space-y-4"
            defaultValue="item-0"
          >
            {faqs
              .filter((_, i) => i % 2 === 0)
              .map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index * 2}`}
                  className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-sm"
                >
                  <AccordionTrigger className="text-sm font-medium text-left hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs
              .filter((_, i) => i % 2 === 1)
              .map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index * 2 + 1}`}
                  className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-sm"
                >
                  <AccordionTrigger className="text-sm font-medium text-left hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
