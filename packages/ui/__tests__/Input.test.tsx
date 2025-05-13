import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Input } from '../src/Input';
import '@testing-library/jest-dom';

describe('Input 组件', () => {
  it('应该正确渲染基本输入框', () => {
    render(<Input placeholder="请输入内容" />);
    const input = screen.getByPlaceholderText('请输入内容');
    expect(input).toBeInTheDocument();
  });

  it('应该处理输入事件', async () => {
    const handleChange = vi.fn();
    render(<Input placeholder="请输入内容" onChange={handleChange} />);
    
    const input = screen.getByPlaceholderText('请输入内容');
    await userEvent.type(input, 'test');
    
    expect(handleChange).toHaveBeenCalledTimes(4); // 每个字符触发一次
    expect(input).toHaveValue('test');
  });

  it('禁用状态时不应接受输入', async () => {
    render(<Input placeholder="请输入内容" disabled />);
    
    const input = screen.getByPlaceholderText('请输入内容');
    expect(input).toBeDisabled();
    
    // 尝试输入但不应成功
    await userEvent.type(input, 'test');
    expect(input).toHaveValue('');
  });

  it('应该正确渲染带startSlot的输入框', () => {
    render(
      <Input 
        placeholder="搜索内容" 
        startSlot={<span data-testid="search-icon">🔍</span>} 
      />
    );
    
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('搜索内容')).toBeInTheDocument();
  });

  it('应该正确渲染带endSlot的输入框', () => {
    render(
      <Input 
        placeholder="清除输入" 
        endSlot={<span data-testid="clear-icon">✖</span>} 
      />
    );
    
    expect(screen.getByTestId('clear-icon')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('清除输入')).toBeInTheDocument();
  });

  it('应该支持默认值设置', () => {
    render(<Input defaultValue="默认内容" />);
    expect(screen.getByDisplayValue('默认内容')).toBeInTheDocument();
  });

  it('应该正确处理受控组件模式', async () => {
    const { rerender } = render(<Input value="初始值" readOnly />);
    expect(screen.getByDisplayValue('初始值')).toBeInTheDocument();
    
    // 更新值
    rerender(<Input value="更新的值" readOnly />);
    expect(screen.getByDisplayValue('更新的值')).toBeInTheDocument();
  });

  it('应该支持不同的尺寸', () => {
    const { rerender } = render(<Input size="sm" data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input.parentElement?.className).toContain('size-sm');
    
    rerender(<Input size="md" data-testid="input" />);
    expect(input.parentElement?.className).toContain('size-md');
  });

  it('应该支持不同的样式变体', () => {
    const { rerender } = render(<Input variant="default" data-testid="input" />);
    const input = screen.getByTestId('input');
    
    // 验证背景元素样式
    const backgroundElement = input.parentElement?.querySelector('div:last-child');
    expect(backgroundElement?.className).toContain('variant-default');
    
    rerender(<Input variant="subtle" data-testid="input" />);
    const updatedBackgroundElement = input.parentElement?.querySelector('div:last-child');
    expect(updatedBackgroundElement?.className).toContain('variant-subtle');
  });

  it('应该支持无效状态样式', () => {
    render(<Input state="invalid" data-testid="input" />);
    const input = screen.getByTestId('input');
    
    const backgroundElement = input.parentElement?.querySelector('div:last-child');
    expect(backgroundElement?.className).toContain('state-invalid');
  });

  it('应该支持有效状态样式', () => {
    render(<Input state="valid" data-testid="input" />);
    const input = screen.getByTestId('input');
    
    const backgroundElement = input.parentElement?.querySelector('div:last-child');
    expect(backgroundElement?.className).toContain('state-valid');
  });
}); 