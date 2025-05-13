import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Select, SelectItem } from '../src/Select';
import '@testing-library/jest-dom';

// 这里我们只测试单选模式，多选模式会单独测试
describe('Select 组件 (单选模式)', () => {
  it('应该正确渲染单选框', () => {
    render(
      <Select placeholder="请选择一个选项">
        <SelectItem value="option1">选项 1</SelectItem>
        <SelectItem value="option2">选项 2</SelectItem>
        <SelectItem value="option3">选项 3</SelectItem>
      </Select>
    );
    
    // 选择器应该呈现为一个按钮
    const selectTrigger = screen.getByRole('combobox');
    expect(selectTrigger).toBeInTheDocument();
    expect(selectTrigger).toHaveTextContent('请选择一个选项');
  });

  it('应该支持默认值', () => {
    render(
      <Select defaultValue="option2">
        <SelectItem value="option1">选项 1</SelectItem>
        <SelectItem value="option2">选项 2</SelectItem>
        <SelectItem value="option3">选项 3</SelectItem>
      </Select>
    );
    
    const selectTrigger = screen.getByRole('combobox');
    expect(selectTrigger).toHaveTextContent('选项 2');
  });

  it('应该支持受控值', () => {
    const { rerender } = render(
      <Select value="option1">
        <SelectItem value="option1">选项 1</SelectItem>
        <SelectItem value="option2">选项 2</SelectItem>
        <SelectItem value="option3">选项 3</SelectItem>
      </Select>
    );
    
    expect(screen.getByRole('combobox')).toHaveTextContent('选项 1');
    
    // 更新值
    rerender(
      <Select value="option3">
        <SelectItem value="option1">选项 1</SelectItem>
        <SelectItem value="option2">选项 2</SelectItem>
        <SelectItem value="option3">选项 3</SelectItem>
      </Select>
    );
    
    expect(screen.getByRole('combobox')).toHaveTextContent('选项 3');
  });

  it('应该支持不同的尺寸', () => {
    const { rerender } = render(
      <Select size="sm" placeholder="小尺寸">
        <SelectItem value="option1">选项 1</SelectItem>
      </Select>
    );
    
    let selectTrigger = screen.getByRole('combobox');
    expect(selectTrigger.className).toContain('size-sm');
    
    rerender(
      <Select size="md" placeholder="中尺寸">
        <SelectItem value="option1">选项 1</SelectItem>
      </Select>
    );
    
    selectTrigger = screen.getByRole('combobox');
    expect(selectTrigger.className).toContain('size-md');
  });

  it('应该支持自定义渲染选择项', () => {
    // 在单选模式下测试valueRenderer
    const customRenderer = (value: string | number) => {
      return <span data-testid="custom-renderer">自定义: {value}</span>;
    };
    
    render(
      <Select valueRenderer={customRenderer} value="option1">
        <SelectItem value="option1">选项 1</SelectItem>
        <SelectItem value="option2">选项 2</SelectItem>
      </Select>
    );
    
    expect(screen.getByTestId('custom-renderer')).toBeInTheDocument();
    expect(screen.getByTestId('custom-renderer')).toHaveTextContent('自定义: option1');
  });
});

describe('Select 组件 (多选模式)', () => {
  it('应该正确渲染多选框', () => {
    render(
      <Select multiple placeholder="请选择多个选项">
        <SelectItem value="option1">选项 1</SelectItem>
        <SelectItem value="option2">选项 2</SelectItem>
        <SelectItem value="option3">选项 3</SelectItem>
      </Select>
    );
    
    const comboboxTrigger = screen.getByRole('button');
    expect(comboboxTrigger).toBeInTheDocument();
    expect(comboboxTrigger).toHaveTextContent('请选择多个选项');
  });

  it('应该支持默认值 (多选)', () => {
    render(
      <Select multiple defaultValue={["option1", "option3"]}>
        <SelectItem value="option1">选项 1</SelectItem>
        <SelectItem value="option2">选项 2</SelectItem>
        <SelectItem value="option3">选项 3</SelectItem>
      </Select>
    );
    
    // 触发器应该显示选中的项
    const trigger = screen.getByRole('button');
    expect(trigger.textContent).not.toBe('请选择多个选项');
  });
}); 