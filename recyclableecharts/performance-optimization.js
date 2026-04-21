/**
 * 性能优化通用工具函数
 * 用于垃圾回收大屏动画组件的性能优化
 */

/**
 * 防抖函数 - 限制函数执行频率
 * @param {Function} func - 需要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 */
export function debounce(func, wait = 300) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * 节流函数 - 按固定时间间隔执行
 * @param {Function} func - 需要节流的函数
 * @param {number} limit - 时间间隔（毫秒）
 */
export function throttle(func, limit = 100) {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 优化 Canvas 渲染性能
 * - 使用离屏 Canvas 缓存静态内容
 * - 分层渲染动态和静态元素
 */
export class CanvasOptimizer {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.offscreenCanvas = null
    this.offscreenCtx = null
    this.layers = {}
  }

  /**
   * 创建离屏 Canvas 用于缓存
   */
  createOffscreenCanvas() {
    this.offscreenCanvas = document.createElement('canvas')
    this.offscreenCanvas.width = this.canvas.width
    this.offscreenCanvas.height = this.canvas.height
    this.offscreenCtx = this.offscreenCanvas.getContext('2d')
  }

  /**
   * 创建分层渲染
   * @param {string} name - 图层名称
   */
  createLayer(name) {
    const layer = document.createElement('canvas')
    layer.width = this.canvas.width
    layer.height = this.canvas.height
    this.layers[name] = {
      canvas: layer,
      ctx: layer.getContext('2d'),
      dirty: true
    }
  }

  /**
   * 渲染到离屏 Canvas
   * @param {Function} drawFunction - 绘制函数
   */
  renderToOffscreen(drawFunction) {
    if (!this.offscreenCtx) {
      this.createOffscreenCanvas()
    }
    drawFunction(this.offscreenCtx)
  }

  /**
   * 合成所有图层到主 Canvas
   */
  composite() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    if (this.offscreenCanvas) {
      this.ctx.drawImage(this.offscreenCanvas, 0, 0)
    }
    
    Object.values(this.layers).forEach(layer => {
      if (layer.dirty) {
        this.ctx.drawImage(layer.canvas, 0, 0)
      }
    })
  }

  /**
   * 标记图层为脏（需要重绘）
   * @param {string} name - 图层名称
   */
  markLayerDirty(name) {
    if (this.layers[name]) {
      this.layers[name].dirty = true
    }
  }

  /**
   * 标记图层为干净（已绘制）
   * @param {string} name - 图层名称
   */
  markLayerClean(name) {
    if (this.layers[name]) {
      this.layers[name].dirty = false
    }
  }
}

/**
 * ECharts 性能优化配置
 */
export const echartsOptimization = {
  /**
   * 基础优化配置
   */
  baseOption: {
    animation: true,
    animationThreshold: 2000,
    animationDuration: 1000,
    animationDurationUpdate: 800,
    animationEasing: 'cubicOut',
    animationEasingUpdate: 'cubicOut'
  },

  /**
   * 大数据量优化配置
   */
  largeDataOption: {
    large: true,
    largeThreshold: 2000,
    progressive: 200,
    progressiveThreshold: 3000
  },

  /**
   * 禁用不必要的特性提升性能
   */
  performanceOption: {
    disableLabelLayout: true,
    disableEdgeFilter: true
  }
}

/**
 * 响应式断点管理
 */
export const responsiveBreakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
  largeScreen: 1920,
  extraLargeScreen: 2560
}

/**
 * 获取当前屏幕尺寸类别
 * @param {number} width - 屏幕宽度
 * @returns {string} 屏幕类别
 */
export function getScreenCategory(width) {
  if (width < responsiveBreakpoints.mobile) return 'mobile'
  if (width < responsiveBreakpoints.tablet) return 'tablet'
  if (width < responsiveBreakpoints.desktop) return 'desktop'
  if (width < responsiveBreakpoints.largeScreen) return 'largeScreen'
  return 'extraLargeScreen'
}

/**
 * 根据屏幕尺寸计算合适的图表配置
 * @param {string} category - 屏幕类别
 * @param {Object} baseConfig - 基础配置
 */
export function getResponsiveConfig(category, baseConfig) {
  const configs = {
    mobile: {
      fontSize: baseConfig.fontSize * 0.7,
      itemSize: baseConfig.itemSize * 0.7,
      padding: baseConfig.padding * 0.7
    },
    tablet: {
      fontSize: baseConfig.fontSize * 0.85,
      itemSize: baseConfig.itemSize * 0.85,
      padding: baseConfig.padding * 0.85
    },
    desktop: {
      fontSize: baseConfig.fontSize,
      itemSize: baseConfig.itemSize,
      padding: baseConfig.padding
    },
    largeScreen: {
      fontSize: baseConfig.fontSize * 1.1,
      itemSize: baseConfig.itemSize * 1.1,
      padding: baseConfig.padding * 1.1
    },
    extraLargeScreen: {
      fontSize: baseConfig.fontSize * 1.2,
      itemSize: baseConfig.itemSize * 1.2,
      padding: baseConfig.padding * 1.2
    }
  }
  return configs[category] || configs.desktop
}

/**
 * 内存管理工具
 */
export class MemoryManager {
  constructor() {
    this.objects = new WeakMap()
    this.disposables = []
  }

  /**
   * 注册可释放对象
   * @param {Object} obj - 需要释放的对象
   * @param {Function} disposeFn - 释放函数
   */
  register(obj, disposeFn) {
    this.disposables.push({ obj, disposeFn })
  }

  /**
   * 释放所有注册的对象
   */
  disposeAll() {
    this.disposables.forEach(({ obj, disposeFn }) => {
      try {
        disposeFn(obj)
      } catch (e) {
        console.error('Error disposing object:', e)
      }
    })
    this.disposables = []
  }

  /**
   * 清理不再使用的对象
   */
  cleanup() {
    if (typeof gc === 'function') {
      gc()
    }
  }
}

/**
 * 动画帧率控制器
 */
export class FrameRateController {
  constructor(targetFPS = 60) {
    this.targetFPS = targetFPS
    this.frameInterval = 1000 / targetFPS
    this.lastFrameTime = 0
    this.frameCount = 0
    this.fps = 0
    this.lastFpsUpdate = 0
  }

  /**
   * 检查是否应该渲染下一帧
   * @param {number} currentTime - 当前时间
   * @returns {boolean} 是否渲染
   */
  shouldRender(currentTime) {
    const elapsed = currentTime - this.lastFrameTime
    
    if (elapsed >= this.frameInterval) {
      this.lastFrameTime = currentTime - (elapsed % this.frameInterval)
      this.frameCount++
      
      if (currentTime - this.lastFpsUpdate >= 1000) {
        this.fps = this.frameCount
        this.frameCount = 0
        this.lastFpsUpdate = currentTime
      }
      
      return true
    }
    return false
  }

  /**
   * 获取当前帧率
   * @returns {number} 当前 FPS
   */
  getFPS() {
    return this.fps
  }

  /**
   * 动态调整目标帧率
   * @param {number} newFPS - 新的目标帧率
   */
  adjustFPS(newFPS) {
    this.targetFPS = newFPS
    this.frameInterval = 1000 / newFPS
  }
}

/**
 * 数据更新优化器
 * 使用差异更新减少不必要的重绘
 */
export class DataUpdateOptimizer {
  constructor() {
    this.previousData = null
    this.changeThreshold = 0.01
  }

  /**
   * 检查数据是否有显著变化
   * @param {Array} newData - 新数据
   * @returns {boolean} 是否有显著变化
   */
  hasSignificantChange(newData) {
    if (!this.previousData) {
      this.previousData = newData
      return true
    }

    if (newData.length !== this.previousData.length) {
      this.previousData = newData
      return true
    }

    let totalChange = 0
    for (let i = 0; i < newData.length; i++) {
      const oldValue = this.previousData[i]?.value || 0
      const newValue = newData[i]?.value || 0
      const change = Math.abs(newValue - oldValue) / (oldValue || 1)
      totalChange += change
    }

    const avgChange = totalChange / newData.length
    this.previousData = newData
    
    return avgChange > this.changeThreshold
  }

  /**
   * 获取需要更新的数据项
   * @param {Array} newData - 新数据
   * @returns {Array} 需要更新的索引
   */
  getChangedIndices(newData) {
    const changedIndices = []
    
    if (!this.previousData) {
      return newData.map((_, i) => i)
    }

    for (let i = 0; i < newData.length; i++) {
      const oldValue = this.previousData[i]?.value || 0
      const newValue = newData[i]?.value || 0
      
      if (Math.abs(newValue - oldValue) > this.changeThreshold) {
        changedIndices.push(i)
      }
    }

    return changedIndices
  }
}
