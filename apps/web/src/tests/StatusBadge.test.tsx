import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { StatusBadge } from '../components/common/StatusBadge';

describe('StatusBadge Component', () => {
  it('renders CRITICAL severity with correct styling', () => {
    render(<StatusBadge status="CRITICAL" />);
    const badge = screen.getByText('CRITICAL');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('text-red-400');
  });

  it('renders PASSED status with emerald styling', () => {
    render(<StatusBadge status="PASSED" />);
    const badge = screen.getByText('PASSED');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('text-emerald-400');
  });

  it('formats underscored status values into readable words', () => {
    render(<StatusBadge status="PENDING_APPROVAL" />);
    expect(screen.getByText('PENDING APPROVAL')).toBeInTheDocument();
  });
});

