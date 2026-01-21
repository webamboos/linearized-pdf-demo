import { describe, it, expect } from 'vitest'
import { shallowRef, ref, defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { providePdfContext, usePdfContext } from './use-pdf-context'
import { createMockPDFDocument } from '@/test/helpers/mock-pdf'

describe('use-pdf-context', () => {
  it('providePdfContext provides context successfully', () => {
    const TestComponent = defineComponent({
      setup() {
        const mockPdf = createMockPDFDocument()
        providePdfContext({ pdf: shallowRef(mockPdf), scale: ref(1.5) })
        return () => 'test'
      },
    })

    expect(() => mount(TestComponent)).not.toThrow()
  })

  it('usePdfContext retrieves provided context', () => {
    const mockPdf = createMockPDFDocument()

    const ProviderComponent = defineComponent({
      setup() {
        providePdfContext({ pdf: shallowRef(mockPdf), scale: ref(1.5) })
        return () => 'provider'
      },
    })

    const ConsumerComponent = defineComponent({
      setup() {
        const context = usePdfContext()
        expect(context).toBeDefined()
        expect(context.pdf.value).toBe(mockPdf)
        expect(context.scale.value).toBe(1.5)
        return () => 'consumer'
      },
    })

    const WrapperComponent = defineComponent({
      components: { ProviderComponent, ConsumerComponent },
      template: '<ProviderComponent><ConsumerComponent /></ProviderComponent>',
      setup() {
        providePdfContext({ pdf: shallowRef(mockPdf), scale: ref(1.5) })
      },
    })

    mount(WrapperComponent)
  })

  it('usePdfContext throws error when called without provider', () => {
    const TestComponent = defineComponent({
      setup() {
        expect(() => usePdfContext()).toThrow(
          'usePdfContext must be used within a component that has called providePdfContext',
        )
        return () => 'test'
      },
    })

    mount(TestComponent)
  })

  it('context contains correct structure', () => {
    const mockPdf = createMockPDFDocument(5)
    const pdfRef = shallowRef(mockPdf)
    const scaleRef = ref(2.0)

    const ChildComponent = defineComponent({
      setup() {
        const context = usePdfContext()

        expect(context.pdf).toBeDefined()
        expect(context.scale).toBeDefined()
        expect(context.pdf.value?.numPages).toBe(5)
        expect(context.scale.value).toBe(2.0)

        return () => '<div>child</div>'
      },
      template: '<div>child</div>',
    })

    const ParentComponent = defineComponent({
      components: { ChildComponent },
      setup() {
        providePdfContext({ pdf: pdfRef, scale: scaleRef })
        return () => '<ChildComponent />'
      },
      template: '<ChildComponent />',
    })

    mount(ParentComponent)
  })

  it('context is reactive', async () => {
    const pdfRef = shallowRef(createMockPDFDocument(1))
    const scaleRef = ref(1.0)

    const ChildComponent = defineComponent({
      setup() {
        const context = usePdfContext()

        expect(context.scale.value).toBe(1.0)

        // Update scale
        scaleRef.value = 2.5
        expect(context.scale.value).toBe(2.5)

        return () => '<div>child</div>'
      },
      template: '<div>child</div>',
    })

    const ParentComponent = defineComponent({
      components: { ChildComponent },
      setup() {
        providePdfContext({ pdf: pdfRef, scale: scaleRef })
        return () => '<ChildComponent />'
      },
      template: '<ChildComponent />',
    })

    mount(ParentComponent)
  })
})
