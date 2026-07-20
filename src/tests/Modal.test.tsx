import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import { Modal } from '../components/Modal'

describe('Modal', () => {
  it('renders its title and content', () => {
    render(
      <Modal title="Bunk K3" onClose={() => {}}>
        <p>Some content</p>
      </Modal>,
    )

    expect(screen.getByRole('dialog', { name: 'Bunk K3' })).toBeVisible()
    expect(screen.getByText('Some content')).toBeVisible()
  })

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn()
    render(
      <Modal title="Bunk K3" onClose={onClose}>
        <p>Some content</p>
      </Modal>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the Escape key is pressed', () => {
    const onClose = vi.fn()
    render(
      <Modal title="Bunk K3" onClose={onClose}>
        <p>Some content</p>
      </Modal>,
    )

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the backdrop is clicked, but not when the dialog itself is clicked', () => {
    const onClose = vi.fn()
    render(
      <Modal title="Bunk K3" onClose={onClose}>
        <p>Some content</p>
      </Modal>,
    )

    fireEvent.click(screen.getByText('Some content'))
    expect(onClose).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('dialog').parentElement as HTMLElement)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
