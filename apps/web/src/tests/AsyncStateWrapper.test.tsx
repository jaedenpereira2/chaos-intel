import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AsyncStateWrapper } from '../components/common/AsyncStateWrapper';

describe('AsyncStateWrapper Component', () => {
  it('renders loading state when isLoading is true', () => {
    render(
      <AsyncStateWrapper isLoading={true} isError={false}>
        {() => <div>Loaded Content</div>}
      </AsyncStateWrapper>
    );
    expect(screen.getByText(/loading technical telemetry/i)).toBeInTheDocument();
  });

  it('renders error state and handles retry click', () => {
    const handleRetry = vi.fn();
    render(
      <AsyncStateWrapper
        isLoading={false}
        isError={true}
        error={new Error('P3 Gateway Timeout')}
        onRetry={handleRetry}
      >
        {() => <div>Loaded Content</div>}
      </AsyncStateWrapper>
    );
    expect(screen.getByText('P3 Gateway Timeout')).toBeInTheDocument();
    const retryBtn = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('renders empty state when data array is empty', () => {
    render(
      <AsyncStateWrapper isLoading={false} isError={false} data={[]} isEmpty={true}>
        {() => <div>Loaded Content</div>}
      </AsyncStateWrapper>
    );
    expect(screen.getByText('No data found')).toBeInTheDocument();
  });

  it('renders children with data when loaded successfully', () => {
    render(
      <AsyncStateWrapper isLoading={false} isError={false} data={{ name: 'Storefront' }}>
        {(data) => <div>Service: {data.name}</div>}
      </AsyncStateWrapper>
    );
    expect(screen.getByText('Service: Storefront')).toBeInTheDocument();
  });
});

