import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Checkbox } from '../src/Checkbox';
import '@testing-library/jest-dom';

describe('Checkbox 组件', () => {
  afterEach(() => {
    cleanup();
  });

  it('应该正确渲染', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('应该渲染带标签的复选框', () => {
    render(<Checkbox withLabel label="同意条款" />);
    expect(screen.getByText('同意条款')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('应该处理选中状态', async () => {
    const handleChange = vi.fn();
    render(<Checkbox onCheckedChange={handleChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);
    
    expect(handleChange).toHaveBeenCalledWith(true);
    
    // 再次点击
    await userEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it('禁用状态时不应触发变更事件', async () => {
    const handleChange = vi.fn();
    render(<Checkbox disabled onCheckedChange={handleChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);
    
    expect(handleChange).not.toHaveBeenCalled();
    expect(checkbox).toBeDisabled();
  });

  it('应该正确设置初始选中状态', () => {
    const { container: container1 } = render(<Checkbox checked data-testid="checkbox1" />);
    expect(container1.querySelector('[data-testid="checkbox1"]')).toHaveAttribute('data-state', 'checked');
    
    // 在单独的测试区域中使用defaultChecked
    const { container: container2 } = render(<Checkbox defaultChecked data-testid="checkbox2" />);
    expect(container2.querySelector('[data-testid="checkbox2"]')).toHaveAttribute('data-state', 'checked');
  });

  it('点击标签应该触发复选框状态变化', async () => {
    const handleChange = vi.fn();
    render(<Checkbox id="test-checkbox" withLabel label="点击我" onCheckedChange={handleChange} />);
    
    const label = screen.getByText('点击我');
    await userEvent.click(label);
    
    expect(handleChange).toHaveBeenCalledWith(true);
  });
}); 