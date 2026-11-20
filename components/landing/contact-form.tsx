"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getMailtoUrl, getWhatsAppUrl, SITE } from "@/lib/site";
import { WhatsAppIcon } from "./whatsapp-icon";

function composeMessage(
  name: string,
  email: string,
  phone: string,
  message: string
) {
  const parts = [`Hola, soy ${name}.`];
  if (phone) parts.push(`Teléfono: ${phone}`);
  if (email) parts.push(`Correo: ${email}`);
  parts.push("", message);
  return parts.join("\n");
}

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const body = composeMessage(name, email, phone, message);

  const onWhatsApp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.open(getWhatsAppUrl(body), "_blank", "noopener,noreferrer");
  };

  const onMailto = () => {
    window.location.href = getMailtoUrl(
      `Mensaje desde la web — ${SITE.name}`,
      body
    );
  };

  return (
    <form
      onSubmit={onWhatsApp}
      className="space-y-4 rounded-[1.75rem] border border-border bg-card p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Nombre</Label>
          <Input
            id="contact-name"
            name="name"
            required
            autoComplete="name"
            placeholder="Tu nombre"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="bg-background"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Correo</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="tucorreo@ejemplo.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="bg-background"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-phone">Teléfono</Label>
        <Input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="300 000 0000"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="bg-background"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-message">Mensaje</Label>
        <Textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          placeholder="¿En qué grado estás interesado o interesada?"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="bg-background"
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="submit"
          className="h-11 flex-1 rounded-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90"
        >
          <WhatsAppIcon />
          Enviar por WhatsApp
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 flex-1 rounded-full"
          onClick={onMailto}
        >
          <Mail />
          Enviar por correo
        </Button>
      </div>
    </form>
  );
}
