/**
 * 响应式样式配置
 * 针对不同屏幕尺寸优化显示效果
 */

export const responsiveStyles = {
  // 基础字体大小配置
  fontSize: {
    mobile: 12,
    tablet: 13,
    desktop: 14,
    largeScreen: 16,
    extraLargeScreen: 18
  },

  // 图表尺寸配置
  chartSize: {
    mobile: {
      height: 200,
      radius: ['40%', '60%']
    },
    tablet: {
      height: 280,
      radius: ['45%', '65%']
    },
    desktop: {
      height: 350,
      radius: ['50%', '70%']
    },
    largeScreen: {
      height: 450,
      radius: ['55%', '75%']
    },
    extraLargeScreen: {
      height: 550,
      radius: ['60%', '80%']
    }
  },

  // 动画时长配置
  animationDuration: {
    mobile: 800,
    tablet: 900,
    desktop: 1000,
    largeScreen: 1200,
    extraLargeScreen: 1400
  },

  // 间距配置
  spacing: {
    mobile: 8,
    tablet: 10,
    desktop: 12,
    largeScreen: 15,
    extraLargeScreen: 18
  },

  // 边框圆角配置
  borderRadius: {
    mobile: 4,
    tablet: 5,
    desktop: 6,
    largeScreen: 8,
    extraLargeScreen: 10
  }
}

/**
 * 获取媒体查询 CSS
 * @param {string} breakpoint - 断点名称
 * @param {string} css - CSS 内容
 * @returns {string} 完整的媒体查询 CSS
 */
export function getMediaQuery(breakpoint, css) {
  const breakpoints = {
    mobile: '@media screen and (max-width: 767px)',
    tablet: '@media screen and (min-width: 768px) and (max-width: 1023px)',
    desktop: '@media screen and (min-width: 1024px) and (max-width: 1439px)',
    largeScreen: '@media screen and (min-width: 1440px) and (max-width: 1919px)',
    extraLargeScreen: '@media screen and (min-width: 1920px)'
  }

  return `${breakpoints[breakpoint]} { ${css} }`
}

/**
 * 生成响应式 CSS 变量
 * @returns {string} CSS 变量定义
 */
export function generateCSSVariables() {
  return `
    :root {
      --font-size-base: 14px;
      --chart-height: 350px;
      --spacing-base: 12px;
      --border-radius-base: 6px;
      --animation-duration: 1000ms;
    }

    @media screen and (max-width: 767px) {
      :root {
        --font-size-base: 12px;
        --chart-height: 200px;
        --spacing-base: 8px;
        --border-radius-base: 4px;
        --animation-duration: 800ms;
      }
    }

    @media screen and (min-width: 768px) and (max-width: 1023px) {
      :root {
        --font-size-base: 13px;
        --chart-height: 280px;
        --spacing-base: 10px;
        --border-radius-base: 5px;
        --animation-duration: 900ms;
      }
    }

    @media screen and (min-width: 1024px) and (max-width: 1439px) {
      :root {
        --font-size-base: 14px;
        --chart-height: 350px;
        --spacing-base: 12px;
        --border-radius-base: 6px;
        --animation-duration: 1000ms;
      }
    }

    @media screen and (min-width: 1440px) and (max-width: 1919px) {
      :root {
        --font-size-base: 16px;
        --chart-height: 450px;
        --spacing-base: 15px;
        --border-radius-base: 8px;
        --animation-duration: 1200ms;
      }
    }

    @media screen and (min-width: 1920px) {
      :root {
        --font-size-base: 18px;
        --chart-height: 550px;
        --spacing-base: 18px;
        --border-radius-base: 10px;
        --animation-duration: 1400ms;
      }
    }
  `
}

/**
 * 大屏优化配置
 */
export const largeScreenOptimization = {
  // 1920x1080 及以上分辨率优化
  enabled: true,
  
  // 提高渲染质量
  renderQuality: {
    devicePixelRatio: 2,
    antialias: true
  },
  
  // 性能优化
  performance: {
    useGPU: true,
    enableLayerization: true,
    maxParticleCount: 500
  }
}

/**
 * 生成适配大屏的 CSS
 * @returns {string} 大屏优化 CSS
 */
export function getLargeScreenCSS() {
  return `
    @media screen and (min-width: 1920px) {
      .echartsdiv {
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
      }
      
      canvas {
        image-rendering: high-quality;
      }
      
      .chart-container {
        transform-origin: center;
      }
    }

    @media screen and (min-width: 2560px) {
      .echartsdiv {
        max-width: 100%;
        max-height: 100%;
      }
    }
  `
}

/**
 * 动画性能级别配置
 */
export const animationPerformanceLevels = {
  low: {
    maxParticles: 50,
    enableShadows: false,
    enableGradients: false,
    fps: 30
  },
  medium: {
    maxParticles: 200,
    enableShadows: true,
    enableGradients: true,
    fps: 60
  },
  high: {
    maxParticles: 500,
    enableShadows: true,
    enableGradients: true,
    fps: 60
  },
  ultra: {
    maxParticles: 1000,
    enableShadows: true,
    enableGradients: true,
    fps: 60
  }
}

/**
 * 根据设备性能自动选择动画级别
 * @returns {string} 性能级别
 */
export function detectPerformanceLevel() {
  const deviceMemory = navigator.deviceMemory || 4
  const hardwareConcurrency = navigator.hardwareConcurrency || 4
  
  if (deviceMemory >= 8 && hardwareConcurrency >= 8) {
    return 'ultra'
  } else if (deviceMemory >= 4 && hardwareConcurrency >= 4) {
    return 'high'
  } else if (deviceMemory >= 2 && hardwareConcurrency >= 2) {
    return 'medium'
  } else {
    return 'low'
  }
}
