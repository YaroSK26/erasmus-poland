"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import emailjs from "@emailjs/browser";
import { Toaster, toast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2, { message: "Meno musí mať aspoň 2 znaky" }),
  email: z.string().email({ message: "Neplatný email" }),
  message: z.string().min(10, { message: "Správa musí mať aspoň 10 znakov" }),
});

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ContactForm() {
  const [translations, setTranslations] = useState({
    form: {
      contactUsTitle: "Kontaktujte nás",
      nameLabel: "Meno",
      namePlaceholder: "Vaše meno",
      emailLabel: "Email",
      emailPlaceholder: "vas@email.com",
      messageLabel: "Správa",
      messagePlaceholder: "Vaša správa...",
      submitButton: "Odoslať",
      sendingButton: "Odosielam...",
      successMessage: "Správa bola úspešne odoslaná",
      errorMessage: "Nastala chyba pri odosielaní",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

useEffect(() => {
  const loadTranslations = async () => {
    try {
      const language = localStorage.getItem("language") || "sk";
      const translationsModule = await import(
        `../public/locales/${language}.json`
      );
      setTranslations(translationsModule.default);
    } catch (error) {
      console.error("Error loading translations:", error);
    }
  };
  loadTranslations();
}, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await emailjs.send(
        "service_81tw9xw",
        "template_m37okw1",
        values,
        "ao9Pnvt-EA8-h9gBU"
      );
      toast.success(translations.form.successMessage);
      form.reset();
    } catch (error) {
      toast.error(translations.form.errorMessage);
      console.error("Error sending email:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-16 px-4 bg-[#F6FAFF] min-h-screen flex items-center justify-center">
      <Toaster position="top-center" reverseOrder={false} />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="w-full max-w-lg mx-auto"
      >
        <Card className="shadow-lg">
          <CardHeader className="bg-white rounded-t-lg">
            <CardTitle className="text-2xl md:text-3xl font-bold text-center text-gray-800">
              {translations.form.contactUsTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          {translations.form.nameLabel}
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                            placeholder={translations.form.namePlaceholder}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          {translations.form.emailLabel}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                            placeholder={translations.form.emailPlaceholder}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          {translations.form.messageLabel}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                            placeholder={translations.form.messagePlaceholder}
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? translations.form.sendingButton
                      : translations.form.submitButton}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
