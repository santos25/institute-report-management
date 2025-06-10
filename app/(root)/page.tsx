import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Heart,
  Users,
  BookOpen,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Palette,
  Play,
  ArrowRight,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Ambiente Cálido",
    description:
      "Un entorno seguro y amoroso donde cada niño y niña se siente valorado y protegido.",
    color: "from-pink-400 to-rose-400",
    bgColor: "bg-pink-50",
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Educación Integral",
    description:
      "Desarrollo cognitivo, emocional y social a través de metodologías innovadoras.",
    color: "from-blue-400 to-cyan-400",
    bgColor: "bg-blue-50",
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "Arte y Creatividad",
    description:
      "Fomentamos la expresión artística y la creatividad en distintas formas.",
    color: "from-purple-400 to-violet-400",
    bgColor: "bg-purple-50",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Clases personalizadas",
    description:
      "Atención personalizada con grupos reducidos para ayudar al aprendizaje.",
    color: "from-green-400 to-emerald-400",
    bgColor: "bg-green-50",
  },
];

const programs = [
  {
    image: "/images/img1.jpg",
    title: "Párvulo",
    age: "2-3 años",
    description:
      "Una suave introducción al mundo escolar, enfocada en la socialización y el desarrollo de la motricidad.",
    features: ["Juego libre", "Motricidad", "Socialización", "Rutinas básicas"],
    color: "from-pink-500 to-rose-500",
  },
  {
    image: "/images/img2.jpg",
    title: "Pre Jardín",
    age: "3-4 años",
    description:
      "Fomentamos la curiosidad a través de actividades de exploración y conceptos básicos.",
    features: ["Exploración", "Pre-lectura", "Números básicos", "Arte"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    image: "/images/img3.jpg",
    title: "Jardín",
    age: "4-5 años",
    description:
      "Preparamos a los niños para la etapa escolar con un programa estructurado y divertido.",
    features: [
      "Lectoescritura",
      "Matemáticas",
      "Ciencias",
      "Preparación escolar",
    ],
    color: "from-purple-500 to-violet-500",
  },
];

const galleryImages = [
  {
    src: "/images/img4.jpg",
    alt: "Niños aprendiendo en clase",
    category: "Aprendizaje",
  },
  {
    src: "/images/img5.jpg",
    alt: "Actividades al aire libre",
    category: "Recreación",
  },
  { src: "/images/img6.jpg", alt: "Proyecto de arte", category: "Arte" },
  {
    src: "/images/img7.jpg",
    alt: "Juegos en grupo",
    category: "Socialización",
  },
  { src: "/images/img2.jpg", alt: "Hora del cuento", category: "Lectura" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section with Parallax Effect */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/img4.jpg"
            alt="Niños felices en el jardín"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-purple-900/40 to-pink-900/50" />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-bounce" />
          <div className="absolute top-40 right-20 w-16 h-16 bg-pink-400/20 rounded-full animate-pulse" />
          <div className="absolute bottom-40 left-20 w-24 h-24 bg-blue-400/20 rounded-full animate-bounce delay-1000" />
          <div className="absolute bottom-20 right-10 w-12 h-12 bg-purple-400/20 rounded-full animate-pulse delay-500" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Instituto
            </span>
            <br />
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Angelitos Alegres
            </span>
          </h1>

          <p className="text-2xl md:text-3xl mb-12 leading-relaxed opacity-90 max-w-4xl mx-auto">
            Formando el futuro de nuestros niños y niñas con amor, dedicación y
            excelencia educativa
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 px-10 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 text-lg"
            >
              <Play className="w-6 h-6 mr-3" />
              Conoce Nuestros Programas
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-22 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section
        id="nosotros"
        className="py-24 px-4 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-pink-500 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-8">
              Educación que{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Transforma
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Creamos experiencias de aprendizaje únicas que inspiran a nuestros
              niños y niñas a explorar, crear y crecer en un ambiente lleno de
              amor y dedicación.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group shadow-2xl transition-all duration-700 border-0 hover:-translate-y-4 overflow-hidden relative bg-white backdrop-blur-sm cursor-pointer"
              >
                {/* Animated Background Gradient - Always visible */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 group-hover:opacity-20 transition-all duration-700`}
                />

                {/* Floating Particles Effect - Always visible */}
                <div className="absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-ping" />
                  <div className="absolute bottom-6 left-6 w-1 h-1 bg-white rounded-full animate-pulse delay-300" />
                  <div className="absolute top-1/2 right-8 w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-500" />
                </div>

                <CardHeader className="text-center relative z-10 pb-4">
                  {/* Icon Container with Modern Design */}
                  <div className="relative mx-auto mb-6">
                    <div
                      className={`w-20 h-20 ${feature.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-xl relative overflow-hidden`}
                    >
                      {/* Icon Background Glow - Always visible */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-25 group-hover:opacity-35 transition-opacity duration-500`}
                      />

                      {/* Icon with Proper Color */}
                      <div className="relative z-10 text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                        {feature.icon}
                      </div>

                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>

                    {/* Floating Ring - Always visible */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-white/40 transition-all duration-500 scale-110" />
                  </div>

                  <CardTitle className="text-xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors duration-300 mb-2">
                    {feature.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="relative z-10 pt-0">
                  <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300 text-center">
                    {feature.description}
                  </p>

                  {/* Interactive Button - Always visible */}
                  <div className="mt-6 opacity-100 transition-all duration-500">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-full bg-gradient-to-r ${feature.color} text-white hover:shadow-lg transition-all duration-300 border-0 group-hover:scale-105`}
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Conocer Más
                    </Button>
                  </div>
                </CardContent>

                {/* Corner Accent - Always visible */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                  <div
                    className={`absolute top-0 right-0 w-8 h-8 bg-gradient-to-br ${feature.color} transform rotate-45 translate-x-4 -translate-y-4 opacity-70 group-hover:opacity-100 transition-all duration-500`}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Programs Section */}
      <section id="programs" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-8">
              Grados diseñados para{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Crecer
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Cada grado tiene su propio programa especializado para maximizar
              el potencial de aprendizaje de nuestros niños y niñas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {programs.map((program, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-8 overflow-hidden relative"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${program.color} opacity-40 group-hover:opacity-40 transition-opacity duration-500`}
                  />
                  <Badge
                    className={`absolute top-4 right-4 bg-white text-gray-800 border-0 shadow-lg`}
                  >
                    {program.age}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                    {program.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {program.description}
                  </p>
                  <div className="space-y-2 mb-6">
                    {program.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className={`w-full bg-gradient-to-r ${program.color} hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Conocer Más
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Ver otros grados button */}
          <div className="flex justify-center mt-16">
            <Button
              variant="outline"
              size="lg"
              className="bg-white border-2 border-purple-200 text-purple-600 hover:bg-purple-600 hover:text-white hover:border-purple-600 font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg"
            >
              <BookOpen className="w-5 h-5 mr-3" />
              Ver otros grados
            </Button>
          </div>
        </div>
      </section>

      {/* Immersive Gallery Section */}
      <section
        id="galeria"
        className="py-24 px-4 bg-gradient-to-br from-purple-50 to-pink-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-8">
              Nuestros{" "}
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Angelitos
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Cada día está lleno de descubrimientos, risas y momentos mágicos
              que capturamos para compartir con las familias.
            </p>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {galleryImages.map((image, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <Badge
                        variant="secondary"
                        className="absolute top-4 left-4 bg-white/90 text-gray-800 border-0"
                      >
                        {image.category}
                      </Badge>
                      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <h3 className="font-bold text-lg mb-1">{image.alt}</h3>
                        <p className="text-sm opacity-90">
                          Momentos únicos de aprendizaje
                        </p>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-white/80 backdrop-blur-sm hover:bg-white" />
            <CarouselNext className="right-4 bg-white/80 backdrop-blur-sm hover:bg-white" />
          </Carousel>
        </div>
      </section>

      {/* Modern Contact Section */}
      <section
        id="contact"
        className="py-24 px-4 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <Badge
                variant="secondary"
                className="mb-6 bg-white/20 text-white border-white/30 px-4 py-2"
              >
                <Phone className="w-4 h-4 mr-2" />
                Contáctanos
              </Badge>
              <p className="text-xl mb-12 opacity-90 leading-relaxed">
                Estamos aquí para ayudarte. Contáctanos para más información o
                iniciar el proceso de inscripción.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="p-3 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors duration-300">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="text-lg">
                    Nuevo bosque transversal 51, Cartagena, Colombia
                  </span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="p-3 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors duration-300">
                    <Phone className="w-6 h-6" />
                  </div>
                  <span className="text-lg">(+57) 300 2850238</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="p-3 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors duration-300">
                    <Mail className="w-6 h-6" />
                  </div>
                  <span className="text-lg">angelitosalegres@hotmail.com</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="p-3 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors duration-300">
                    <Clock className="w-6 h-6" />
                  </div>
                  <span className="text-lg">Lun - Vie: 7:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>

            <Card className="p-10 shadow-2xl bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-500">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Tu Nombre"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                  />
                  <Input
                    type="email"
                    placeholder="Tu Email"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                  />
                </div>
                <Input
                  placeholder="Teléfono"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                />
                <Textarea
                  placeholder="Tu Mensaje"
                  rows={4}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Enviar Mensaje
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Instituto Angelitos Alegres
                  </h3>
                </div>
              </div>
              <p className="text-gray-300 mb-8 leading-relaxed text-lg max-w-md">
                Formando el futuro de nuestros niños con amor, dedicación y
                excelencia educativa. Cada día es una nueva oportunidad para
                crecer y aprender juntos.
              </p>
              <div className="flex space-x-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white rounded-full p-3 transition-all duration-300"
                >
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-white rounded-full p-3 transition-all duration-300"
                >
                  <Instagram className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-6 text-blue-400">
                Enlaces Rápidos
              </h4>
              <ul className="space-y-3">
                {[
                  "Nosotros",
                  "Grados",
                  "Inscripciones",
                  "Galería",
                  "Contacto",
                ].map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
                    >
                      <ArrowRight className="w-4 h-4" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-6 text-purple-400">
                Horarios
              </h4>
              <div className="space-y-3 text-gray-300">
                <div className="flex justify-between">
                  <span>Lunes - Viernes</span>
                  <span>7:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábados</span>
                  <span>8:00 AM - 12:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingos</span>
                  <span>Cerrado</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Instituto Angelitos Alegres. Todos
              los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
