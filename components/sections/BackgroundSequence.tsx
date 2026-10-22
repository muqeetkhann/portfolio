'use client'

import { useId, useRef, useState, type RefObject } from 'react'
import { EducationList } from '@/components/sections/EducationList'
import { ExperienceList } from '@/components/sections/ExperienceList'
import { SkillsGrid } from '@/components/sections/SkillsGrid'
import { BACKGROUND_COPY } from '@/lib/data'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { prefersReducedMotion, useReducedMotion } from '@/lib/reduced-motion'
import { backgroundSequenceLayout } from '@/lib/scroll-effects'

export type BackgroundSequenceController = {
  measure: () => number
  render: (progress: number) => void
}

/** Desktop receives progress from the page timeline; mobile uses document flow. */
export function BackgroundSequence({ variant, enabled, controller }: {
  variant: 'desktop' | 'mobile'
  enabled: boolean
  controller?: RefObject<BackgroundSequenceController | null>
}) {
  const root = useRef<HTMLDivElement>(null)
  const currentRef = useRef(0)
  const [current, setCurrent] = useState(0)
  const [enhanced, setEnhanced] = useState(false)
  const reduced = useReducedMotion()
  const id = useId()

  useGSAP((_, contextSafe) => {
    const element = root.current
    if (!element || !contextSafe || !enabled || reduced || prefersReducedMotion()) {
      setEnhanced(false)
      return
    }
    const desktop = variant === 'desktop'
    const frameElement = element.parentElement
    const viewport = element.querySelector<HTMLElement>('.background-sequence-viewport')
    const mask = element.querySelector<HTMLElement>('.background-scene-mask')
    const scenes = Array.from(element.querySelectorAll<HTMLElement>('[data-background-scene]'))
    if (!viewport || !mask || !scenes.length || !frameElement) return
    const timeline = gsap.timeline({ paused: true, defaults: { ease: 'none', immediateRender: false } })
    let disposed = false
    let frame = 0
    let boundaries: number[] = []
    let progress = 0
    element.dataset.enhanced = 'true'
    setEnhanced(true)

    const measure = contextSafe(() => {
      const height = desktop ? frameElement.clientHeight : Math.max(240, window.innerHeight - 112)
      element.style.setProperty('--sequence-viewport', `${height}px`)
      const layout = backgroundSequenceLayout(mask.clientHeight, scenes.map(scene => scene.scrollHeight))
      element.style.setProperty('--sequence-height', `${height + layout.distance}px`)
      boundaries = layout.stages.map((stage, index) => index ? stage.start - layout.transition * 0.5 : 0)
      timeline.clear()
      gsap.set(scenes, { autoAlpha: 0, y: 40 })
      gsap.set(scenes[0], { autoAlpha: 1, y: 0 })
      layout.stages.forEach((stage, index) => {
        const scene = scenes[index]
        timeline.fromTo(scene, { autoAlpha: 1, y: 0 }, { autoAlpha: 1, y: 0, duration: stage.hold }, stage.start)
        if (stage.overflow > 0) timeline.fromTo(scene, { y: 0 }, { y: -stage.overflow, duration: stage.overflow }, stage.start + stage.hold)
        if (index < scenes.length - 1) {
          timeline.fromTo(scene, { autoAlpha: 1, y: -stage.overflow }, { autoAlpha: 0, y: -stage.overflow - 40, duration: layout.transition * 0.45 }, stage.end)
          timeline.fromTo(scenes[index + 1], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: layout.transition * 0.45 }, stage.end + layout.transition * 0.55)
        }
      })
      timeline.progress(progress)
      return layout.distance
    })
    const render = (value: number) => {
      progress = Math.min(1, Math.max(0, value))
      timeline.progress(progress)
      const next = boundaries.reduce((selected, start, index) => timeline.time() >= start ? index : selected, 0)
      if (next === currentRef.current) return
      if (scenes[currentRef.current]?.contains(document.activeElement)) element.focus({ preventScroll: true })
      currentRef.current = next
      setCurrent(next)
    }
    measure()
    if (controller) controller.current = { measure, render }
    const trigger = desktop ? null : ScrollTrigger.create({
      trigger: element,
      start: 'top 96px',
      end: () => `+=${timeline.duration()}`,
      invalidateOnRefresh: true,
      onRefreshInit: measure,
      onUpdate: self => render(self.progress),
      onRefresh: self => render(self.progress),
    })
    const refresh = () => {
      if (!disposed && !frame) frame = requestAnimationFrame(() => {
        frame = 0
        if (!disposed) ScrollTrigger.refresh()
      })
    }
    const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(refresh)
    scenes.forEach(scene => resize?.observe(scene))
    if (desktop) resize?.observe(frameElement)
    document.fonts?.ready.then(refresh)
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      resize?.disconnect()
      trigger?.kill()
      if (controller) controller.current = null
      element.removeAttribute('data-enhanced')
      element.style.removeProperty('--sequence-viewport')
      element.style.removeProperty('--sequence-height')
    }
  }, { scope: root, dependencies: [variant, enabled, reduced, controller], revertOnUpdate: true })
  const bodies = [
    <div key="career" className="background-career-overview">
      <div><h3 className="background-stage-title">{BACKGROUND_COPY.experience}</h3><ExperienceList variant={variant} animateTimeline={false} overview /></div>
      <EducationList variant={variant} overview />
    </div>,
    <SkillsGrid key="skills" variant={variant} featured />,
  ]

  return (
    <div ref={root} tabIndex={-1} className="background-sequence" data-variant={variant} data-enhanced={enhanced || undefined}>
      <div className="background-sequence-viewport">
        <div className="background-scene-mask">
          {bodies.map((body, index) => (
            <section key={index} id={`${id}-${index}`} data-background-scene={index} aria-label={BACKGROUND_COPY.stages[index]} aria-hidden={enhanced && current !== index || undefined} inert={enhanced && current !== index}>
              {body}
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
