import Navbar from '@/components/Navbar'
import Hero from '@/components/sections/Hero'
import Experience from '@/components/sections/Experience'
import Projects from '@/components/sections/Projects'
import Skills from '@/components/sections/Skills'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="relative z-10">
      <Navbar />
      <Hero />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </main>
  )
}
