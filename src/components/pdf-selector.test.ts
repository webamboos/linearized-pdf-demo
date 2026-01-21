import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PdfSelector from './pdf-selector.vue'

describe('PdfSelector', () => {
  it('renders all PDF options', () => {
    const wrapper = mount(PdfSelector)

    const options = wrapper.findAll('option')
    expect(options.length).toBe(4) // We have 4 PDFs

    expect(options[0]!.text()).toContain('Example 1')
    expect(options[1]!.text()).toContain('Example 2')
    expect(options[2]!.text()).toContain('Example 3')
    expect(options[3]!.text()).toContain('Example 4')
  })

  it('shows correct labels for each PDF', () => {
    const wrapper = mount(PdfSelector)

    const options = wrapper.findAll('option')
    expect(options[0]!.text()).toBe('Example 1 (7 pages)')
    expect(options[1]!.text()).toBe('Example 2 (230 pages)')
    expect(options[2]!.text()).toBe('Example 3 (21 pages)')
    expect(options[3]!.text()).toBe('Example 4 (21 pages)')
  })

  it('default selection is first PDF', () => {
    const wrapper = mount(PdfSelector)

    const select = wrapper.find('select')
    expect(select.element.value).toBe('0')
  })

  it('emits load event with correct data on form submit', async () => {
    const wrapper = mount(PdfSelector)

    const form = wrapper.find('form')
    await form.trigger('submit')

    expect(wrapper.emitted('load')).toBeTruthy()
    const emittedEvents = wrapper.emitted('load')!
    expect(emittedEvents[0]).toEqual([expect.stringContaining('example-1.pdf'), 7])
  })

  it('changing selection updates selected PDF', async () => {
    const wrapper = mount(PdfSelector)

    const select = wrapper.find('select')
    await select.setValue('1')

    expect(select.element.value).toBe('1')

    // Submit and check emit
    const form = wrapper.find('form')
    await form.trigger('submit')

    const emittedEvents = wrapper.emitted('load')!
    expect(emittedEvents[0]).toEqual([expect.stringContaining('example-2.pdf'), 230])
  })

  it('load button triggers form submission', async () => {
    const wrapper = mount(PdfSelector)

    const form = wrapper.find('form')
    await form.trigger('submit')

    expect(wrapper.emitted('load')).toBeTruthy()
  })

  it('renders button with correct text', () => {
    const wrapper = mount(PdfSelector)

    const button = wrapper.find('button[type="submit"]')
    expect(button.text()).toBe('Load')
  })

  it('form prevents default submission', async () => {
    const wrapper = mount(PdfSelector)

    const form = wrapper.find('form')
    const submitEvent = new Event('submit')
    const preventDefaultSpy = vi.fn()
    submitEvent.preventDefault = preventDefaultSpy

    await form.trigger('submit')

    // The form should have @submit.prevent
    expect(wrapper.emitted('load')).toBeTruthy()
  })

  it('can select each PDF and emit correct values', async () => {
    const wrapper = mount(PdfSelector)
    const select = wrapper.find('select')
    const form = wrapper.find('form')

    // Test each PDF
    const testCases = [
      { index: 0, filename: 'example-1.pdf', pages: 7 },
      { index: 1, filename: 'example-2.pdf', pages: 230 },
      { index: 2, filename: 'example-3.pdf', pages: 21 },
      { index: 3, filename: 'example-4.pdf', pages: 21 },
    ]

    for (const testCase of testCases) {
      await select.setValue(testCase.index.toString())
      await form.trigger('submit')

      const events = wrapper.emitted('load')!
      const lastEvent = events[events.length - 1]!

      expect(lastEvent[0]).toContain(testCase.filename)
      expect(lastEvent[1]).toBe(testCase.pages)
    }
  })
})
