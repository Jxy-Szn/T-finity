import { Rule } from "sanity";

export default {
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "price",
      title: "Price",
      type: "number",
      validation: (rule: Rule) => rule.required().min(0),
    },
    {
      name: "originalPrice",
      title: "Original Price",
      type: "number",
      validation: (rule: Rule) => rule.min(0),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image" }],
      validation: (rule: Rule) => rule.required().min(1),
    },
    {
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    },
    {
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (rule: Rule) => rule.min(0).max(5),
    },
    {
      name: "reviewCount",
      title: "Review Count",
      type: "number",
      validation: (rule: Rule) => rule.min(0),
    },
    {
      name: "color",
      title: "Color",
      type: "string",
    },
    {
      name: "variant",
      title: "Variant",
      type: "string",
    },
  ],
};
