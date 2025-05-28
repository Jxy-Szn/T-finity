import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I customize my t-shirt?",
    answer:
      "Our easy-to-use customization tool allows you to upload your own designs, add text, choose fonts, colors, and sizes. Simply select a t-shirt, and you'll be guided through the design process.",
  },
  {
    question: "What file formats can I upload for my design?",
    answer:
      "We support various image formats including PNG, JPEG, SVG, and GIF. For best print quality, we recommend high-resolution PNG or SVG files.",
  },
  {
    question: "Can I order multiple t-shirts with different designs?",
    answer:
      "Yes, you can add multiple customized t-shirts to your cart, each with its unique design, size, and color. Just design one, add to cart, and repeat the process for your next unique shirt.",
  },
  {
    question: "What is your return policy for customized t-shirts?",
    answer:
      "Due to the personalized nature of customized t-shirts, we generally do not accept returns unless there is a defect in the product or an error in printing on our part. Please review your design carefully before finalizing your order.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Production time for customized t-shirts is typically 3-5 business days. Shipping times vary based on your location and chosen shipping method (standard or express). You will receive a tracking number once your order ships.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship worldwide! Shipping costs and delivery times for international orders will be calculated at checkout based on your destination.",
  },
  {
    question: "Can I save my design and come back to it later?",
    answer:
      "Absolutely! If you are a registered user, you can save your designs to your account and access them anytime to make edits or place an order later.",
  },
];

export default function Faq() {
  return (
    <>
      <div className="max-w-[85rem] container mx-auto px-4 md:px-6 2xl:max-w-[1400px] py-24 lg:py-32">
        {/* Title */}
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
          <h2 className="text-2xl font-bold md:text-4xl md:leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-1 text-muted-foreground">
            Find answers to common questions about designing, ordering, and
            shipping your personalized apparel.
          </p>
        </div>
        {/* End Title */}

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={faq.question}>
                <AccordionTrigger className="text-lg font-semibold text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </>
  );
}
