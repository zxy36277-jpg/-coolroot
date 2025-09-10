import { create } from 'zustand';
import { ProductInfo, ScriptContent, FormState, ScriptState } from '../types';

interface ToastState {
  type: 'success' | 'error' | 'info' | 'warning' | null;
  message: string;
  isVisible: boolean;
}

interface AppState {
  // 表单状态
  formState: FormState;
  
  // 脚本状态
  scriptState: ScriptState;
  
  // Toast状态
  toastState: ToastState;
  
  // 表单操作
  updateProductInfo: (productInfo: Partial<ProductInfo>) => void;
  setFormLoading: (loading: boolean) => void;
  setFormError: (error: string | null) => void;
  resetForm: () => void;
  
  // 脚本操作
  setScripts: (scripts: ScriptContent[]) => void;
  addScript: (script: ScriptContent) => void;
  updateScript: (id: number, updates: Partial<ScriptContent>) => void;
  setCurrentSessionId: (sessionId: string | null) => void;
  setScriptLoading: (loading: boolean) => void;
  setScriptError: (error: string | null) => void;
  clearScripts: () => void;
  
  // Toast操作
  showToast: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
  hideToast: () => void;
}

const initialProductInfo: ProductInfo = {
  brandName: '',
  sellingPoints: [''],
  promotionInfo: '',
  industry: '',
  targetAudience: '',
  videoPurpose: '',
  platforms: [],
  forbiddenWords: ''
};

const initialFormState: FormState = {
  productInfo: initialProductInfo,
  isLoading: false,
  error: null
};

const initialScriptState: ScriptState = {
  scripts: [],
  currentSessionId: null,
  isLoading: false,
  error: null
};

const initialToastState: ToastState = {
  type: null,
  message: '',
  isVisible: false
};

export const useStore = create<AppState>((set) => ({
  formState: initialFormState,
  scriptState: initialScriptState,
  toastState: initialToastState,
  
  // 表单操作
  updateProductInfo: (productInfo) => {
    console.log('更新产品信息:', productInfo);
    set((state) => {
      const newProductInfo = { ...state.formState.productInfo, ...productInfo };
      console.log('新的产品信息:', newProductInfo);
      return {
        formState: {
          ...state.formState,
          productInfo: newProductInfo
        }
      };
    });
  },
  
  setFormLoading: (loading) => {
    set((state) => ({
      formState: { ...state.formState, isLoading: loading }
    }));
  },
  
  setFormError: (error) => {
    set((state) => ({
      formState: { ...state.formState, error }
    }));
  },
  
  resetForm: () => {
    set({
      formState: initialFormState
    });
  },
  
  // 脚本操作
  setScripts: (scripts) => {
    set((state) => ({
      scriptState: { ...state.scriptState, scripts }
    }));
  },
  
  addScript: (script) => {
    set((state) => ({
      scriptState: {
        ...state.scriptState,
        scripts: [...state.scriptState.scripts, script]
      }
    }));
  },
  
  updateScript: (id, updates) => {
    set((state) => ({
      scriptState: {
        ...state.scriptState,
        scripts: state.scriptState.scripts.map(script =>
          script.id === id ? { ...script, ...updates } : script
        )
      }
    }));
  },
  
  setCurrentSessionId: (sessionId) => {
    set((state) => ({
      scriptState: { ...state.scriptState, currentSessionId: sessionId }
    }));
  },
  
  setScriptLoading: (loading) => {
    set((state) => ({
      scriptState: { ...state.scriptState, isLoading: loading }
    }));
  },
  
  setScriptError: (error) => {
    set((state) => ({
      scriptState: { ...state.scriptState, error }
    }));
  },
  
  clearScripts: () => {
    set((state) => ({
      scriptState: { ...state.scriptState, scripts: [] }
    }));
  },
  
  // Toast操作
  showToast: (type, message) => {
    set({
      toastState: {
        type,
        message,
        isVisible: true
      }
    });
    
    // 5秒后自动隐藏
    setTimeout(() => {
      set((state) => ({
        toastState: { ...state.toastState, isVisible: false }
      }));
    }, 5000);
  },
  
  hideToast: () => {
    set((state) => ({
      toastState: { ...state.toastState, isVisible: false }
    }));
  }
}));
