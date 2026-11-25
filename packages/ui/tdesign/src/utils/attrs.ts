/**
 * TDesign 适配包的属性归一化工具
 *
 * 设计器的 schema 可能来自其它 UI 库（ant-design-vue / element-plus / naive-ui），
 * 换到 TDesign 后，旧属性名与旧枚举值会触发 TDesign 组件的 prop validator 告警，
 * 甚至渲染异常。这里做两件事：
 * 1. 把常见的旧枚举值映射成 TDesign 合法值（尺寸、按钮风格）
 * 2. 按目标组件的 prop 定义过滤掉仍然非法的值（只丢非法项，其余透传）
 */

type AnyProps = Record<string, unknown>;

// 旧 UI 库的尺寸值 → TDesign 合法尺寸（extra-small / small / medium / large）
const SIZE_MAP: Record<string, string> = {
  big: 'large',
  default: 'medium',
  'extra-small': 'extra-small',
  large: 'large',
  medium: 'medium',
  middle: 'medium',
  mini: 'small',
  small: 'small',
  tiny: 'small',
};

// 旧库按钮 type → TDesign theme
const BUTTON_THEME_MAP: Record<string, string> = {
  danger: 'danger',
  default: 'default',
  info: 'default',
  primary: 'primary',
  success: 'success',
  warning: 'warning',
};

// 旧库按钮 type → TDesign variant
const BUTTON_VARIANT_MAP: Record<string, string> = {
  base: 'base',
  dashed: 'dashed',
  ghost: 'outline',
  link: 'text',
  outline: 'outline',
  plain: 'outline',
  text: 'text',
};

/**
 * 按目标组件的 prop 定义过滤非法值
 * @param component TDesign 组件（编译器产物带 props 定义）
 * @param attrs 待透传的属性
 */
export function sanitizeAttrs(component: any, attrs: AnyProps): AnyProps {
  const propsDefinition = (component?.props ?? {}) as Record<string, any>;
  const result: AnyProps = {};

  Object.keys(attrs).forEach((key) => {
    const definition = propsDefinition[key];
    const validator =
      definition && typeof definition === 'object'
        ? definition.validator
        : undefined;
    const value = attrs[key];

    if (typeof validator === 'function' && !validator(value)) {
      return;
    }

    result[key] = value;
  });

  return result;
}

/**
 * 归一化尺寸值（antd 的 middle、element/naive 的 default/tiny 等）
 * @param attrs 待透传的属性
 */
export function normalizeSize(attrs: AnyProps): AnyProps {
  if (!('size' in attrs)) return attrs;

  const mapped = SIZE_MAP[String(attrs.size)];
  if (!mapped) return attrs;

  return { ...attrs, size: mapped };
}

/**
 * 按钮属性归一化：旧 schema 的 type=primary/text/dashed… 映射为 theme/variant
 * @param attrs 待透传的属性
 */
export function normalizeButtonAttrs(attrs: AnyProps): AnyProps {
  const { type, ...rest } = attrs;
  const result = normalizeSize(rest);

  if (typeof type === 'string' && type) {
    if (type === 'submit' || type === 'reset' || type === 'button') {
      // 原生按钮类型，保留
      result.type = type;
    } else if (BUTTON_VARIANT_MAP[type]) {
      if (result.variant === undefined) {
        result.variant = BUTTON_VARIANT_MAP[type];
      }
    } else if (BUTTON_THEME_MAP[type] && result.theme === undefined) {
      result.theme = BUTTON_THEME_MAP[type];
    }
  }

  return result;
}
