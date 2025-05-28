// import React from 'react';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
// import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Button } from '@/components/ui/button';
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from '@/components/ui/select';
// import { Title, Text } from "@/components/ui/typography"
// import { User, Briefcase, FileText } from 'lucide-react';

// export const Careers: React.FC = () => {
//   return (
//     <div className="max-w-2xl mx-auto mt-12 px-4">
//       <Title size="xl" className="text-center mb-4">Join Our Team</Title>
//       <Text className="text-center mb-8">
//         We're excited about your interest in joining us. Please fill out the application form below to get started.
//       </Text>

//       <Card>
//         <CardHeader>
//           <CardTitle className="mb-2 text-2xl">Job Application</CardTitle>
//           <CardDescription className="mb-4 text-sm">
//             All fields marked with an asterisk (*) are required.
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           <Accordion type="single" collapsible>

//             {/* Personal Information */}
//             <AccordionItem value="personal">
//               <AccordionTrigger className="flex items-center gap-3 mb-2 text-xl">
//                 <User className="w-6 h-6" />
//                 Personal Information
//               </AccordionTrigger>
//               <AccordionContent className="mt-4 space-y-6">
//                 {/* fields omitted for brevity, same as before with increased spacing */}
//               </AccordionContent>
//             </AccordionItem>

//             {/* Position Details */}
//             <AccordionItem value="position">
//               <AccordionTrigger className="flex items-center gap-3 mb-2 text-xl">
//                 <Briefcase className="w-6 h-6" />
//                 Position Details
//               </AccordionTrigger>
//               <AccordionContent className="mt-4 space-y-6">
//                 {/* fields omitted for brevity */}
//               </AccordionContent>
//             </AccordionItem>

//             {/* Resume & Documents */}
//             <AccordionItem value="resume">
//               <AccordionTrigger className="flex items-center gap-3 mb-2 text-xl">
//                 <FileText className="w-6 h-6" />
//                 Resume & Documents
//               </AccordionTrigger>
//               <AccordionContent className="mt-4 space-y-6">
//                 {/* fields omitted for brevity */}
//               </AccordionContent>
//             </AccordionItem>

//           </Accordion>

//           <div className="flex items-start space-x-3 mt-6">
//             <Checkbox id="certify" className="h-5 w-5" />
//             <div className="flex flex-col">
//               <Label htmlFor="certify" className="mb-2 text-lg">
//                 I certify that all information provided is accurate *
//               </Label>
//               <Text className="text-xs">
//                 By checking this box, you agree to our <a href="#" className="underline">terms of service</a> and <a href="#" className="underline">privacy policy</a>.
//               </Text>
//             </div>
//           </div>

//           <Button className="w-full py-4 text-lg mt-8">Submit Application</Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };
