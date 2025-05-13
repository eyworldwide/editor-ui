import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../src/Button';
import '@testing-library/jest-dom';

describe('Button 组件', () => {
  it('应该正确渲染文本内容', () => {
    render(<Button>点击我</Button>);
    expect(screen.getByText('点击我')).toBeInTheDocument();
  });

  it('应该处理点击事件', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>点击我</Button>);
    
    const button = screen.getByText('点击我');
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('禁用状态时不应触发点击事件', async () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>点击我</Button>);
    
    const button = screen.getByText('点击我');
    await userEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it('应该渲染不同的变体样式', () => {
    const { rerender } = render(<Button variant="primary">主要按钮</Button>);
    expect(screen.getByText('主要按钮').className).toContain('variant-primary');
    
    rerender(<Button variant="secondary">次要按钮</Button>);
    expect(screen.getByText('次要按钮').className).toContain('variant-secondary');
  });

  it('应该渲染不同的尺寸', () => {
    const { rerender } = render(<Button size="sm">小按钮</Button>);
    expect(screen.getByText('小按钮').className).toContain('size-sm');
    
    rerender(<Button size="md">中按钮</Button>);
    expect(screen.getByText('中按钮').className).toContain('size-md');
    
    rerender(<Button size="lg">大按钮</Button>);
    expect(screen.getByText('大按钮').className).toContain('size-lg');
  });

  it('加载状态应该显示加载指示器', () => {
    render(<Button loading>加载中</Button>);
    const button = screen.getByText('加载中');
    
    expect(button.className).toContain('loading-true');
    const spinElement = button.querySelector('.c-bivtqU');
    expect(spinElement).toBeInTheDocument();
  });

  it('startSlot和endSlot应该正确渲染', () => {
    render(
      <Button 
        startSlot={<span data-testid="start-icon">开始</span>}
        endSlot={<span data-testid="end-icon">结束</span>}
      >
        带图标的按钮
      </Button>
    );
    
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    expect(screen.getByText('带图标的按钮')).toBeInTheDocument();
  });
}); 