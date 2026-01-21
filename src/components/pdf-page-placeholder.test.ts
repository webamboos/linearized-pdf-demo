import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PdfPagePlaceholder from './pdf-page-placeholder.vue'

describe('PdfPagePlaceholder', () => {
  it('renders with correct width and height', () => {
    const wrapper = mount(PdfPagePlaceholder, {
      props: {
        width: 600,
        height: 800,
      },
    })

    const element = wrapper.find('div')
    expect(element.exists()).toBe(true)
    expect(element.attributes('style')).toContain('width: 600px')
    expect(element.attributes('style')).toContain('height: 800px')
  })

  it('shows skeleton animation (has animate-pulse class)', () => {
    const wrapper = mount(PdfPagePlaceholder, {
      props: {
        width: 600,
        height: 800,
      },
    })

    const animatedElement = wrapper.find('.animate-pulse')
    expect(animatedElement.exists()).toBe(true)
  })

  it('applies max-w-full class for responsiveness', () => {
    const wrapper = mount(PdfPagePlaceholder, {
      props: {
        width: 600,
        height: 800,
      },
    })

    const element = wrapper.find('div')
    expect(element.classes()).toContain('max-w-full')
  })

  it('has correct shadow and background', () => {
    const wrapper = mount(PdfPagePlaceholder, {
      props: {
        width: 600,
        height: 800,
      },
    })

    const element = wrapper.find('div')
    expect(element.classes()).toContain('shadow-lg')
    expect(element.classes()).toContain('bg-white')
  })

  it('renders skeleton content elements', () => {
    const wrapper = mount(PdfPagePlaceholder, {
      props: {
        width: 600,
        height: 800,
      },
    })

    // Check for skeleton elements (gray bars that simulate text/images)
    const skeletonElements = wrapper.findAll('.bg-gray-100, .bg-gray-200')
    expect(skeletonElements.length).toBeGreaterThan(0)
  })

  it('handles different dimensions', () => {
    const wrapper = mount(PdfPagePlaceholder, {
      props: {
        width: 400,
        height: 600,
      },
    })

    const element = wrapper.find('div')
    expect(element.attributes('style')).toContain('width: 400px')
    expect(element.attributes('style')).toContain('height: 600px')
  })
})
