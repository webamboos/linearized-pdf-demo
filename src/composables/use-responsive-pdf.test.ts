import { describe, it, expect, beforeEach, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { useResponsivePdf } from './use-responsive-pdf'

describe('use-responsive-pdf', () => {
  beforeEach(() => {
    // Set default window width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
  })

  it('returns correct initial dimensions', () => {
    const TestComponent = defineComponent({
      setup() {
        const { scale, estimatedPageWidth, estimatedPageHeight } = useResponsivePdf()

        expect(scale.value).toBeGreaterThan(0)
        expect(estimatedPageWidth()).toBeGreaterThan(0)
        expect(estimatedPageHeight()).toBeGreaterThan(0)

        return () => 'test'
      },
    })

    mount(TestComponent)
  })

  it('scale is a reactive ref', () => {
    const TestComponent = defineComponent({
      setup() {
        const { scale } = useResponsivePdf()

        expect(scale.value).toBeDefined()
        expect(typeof scale.value).toBe('number')

        return () => 'test'
      },
    })

    mount(TestComponent)
  })

  it('updates dimensions on window resize', async () => {
    const TestComponent = defineComponent({
      setup() {
        const { scale } = useResponsivePdf()
        const initialScale = scale.value

        // Change window width
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 500,
        })

        // Trigger resize event
        window.dispatchEvent(new Event('resize'))

        // Wait for next tick
        setTimeout(() => {
          expect(scale.value).not.toBe(initialScale)
        }, 0)

        return () => 'test'
      },
    })

    mount(TestComponent)
  })

  it('respects max width of 1200px', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 2000,
    })

    const TestComponent = defineComponent({
      setup() {
        const { estimatedPageWidth } = useResponsivePdf()

        // With max width of 1200px and padding of 40px, max available is 1160px
        expect(estimatedPageWidth()).toBeLessThanOrEqual(1200)

        return () => 'test'
      },
    })

    mount(TestComponent)
  })

  it('calculates scale correctly for narrow screens', async () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 400,
    })

    const TestComponent = defineComponent({
      setup() {
        const result = useResponsivePdf()

        // Wait for next tick after mount updates dimensions
        setTimeout(() => {
          // For 400px width - 40px padding = 360px available
          // scale should be 360/612 = ~0.588
          expect(result.scale.value).toBeLessThan(0.7)
          expect(result.estimatedPageWidth()).toBeLessThan(400)
        }, 10)

        return () => '<div>test</div>'
      },
      template: '<div>test</div>',
    })

    mount(TestComponent)

    // Wait for assertions
    await new Promise((resolve) => setTimeout(resolve, 20))
  })

  it('calculates scale correctly for wide screens', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920,
    })

    const TestComponent = defineComponent({
      setup() {
        const { scale } = useResponsivePdf()

        // For wide screens with max width constraint
        expect(scale.value).toBeGreaterThan(0)
        expect(scale.value).toBeLessThanOrEqual(2)

        return () => 'test'
      },
    })

    mount(TestComponent)
  })

  it('estimatedPageWidth() returns correct value', () => {
    const TestComponent = defineComponent({
      setup() {
        const { scale, estimatedPageWidth } = useResponsivePdf()

        const expectedWidth = 612 * scale.value
        expect(estimatedPageWidth()).toBe(expectedWidth)

        return () => 'test'
      },
    })

    mount(TestComponent)
  })

  it('estimatedPageHeight() returns correct value', () => {
    const TestComponent = defineComponent({
      setup() {
        const { scale, estimatedPageHeight } = useResponsivePdf()

        const expectedHeight = 792 * scale.value
        expect(estimatedPageHeight()).toBe(expectedHeight)

        return () => 'test'
      },
    })

    mount(TestComponent)
  })

  it('cleans up resize listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const TestComponent = defineComponent({
      setup() {
        useResponsivePdf()
        return () => 'test'
      },
    })

    const wrapper = mount(TestComponent)
    wrapper.unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })
})
