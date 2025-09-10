import { ProductInfoForm } from './components/ProductInfoForm';
import { ScriptList } from './components/ScriptList';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { Toast } from './components/ui/Toast';
import { useStore } from './store/useStore';

function App() {
  const { scriptState, toastState, hideToast } = useStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Apple风格毛玻璃导航栏 */}
      <div className="sticky top-0 z-50 glass border-b border-white/20">
        <Header />
      </div>
      
      {/* 主内容区域 - 大量留白，内容聚焦 */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {scriptState.scripts.length > 0 ? (
            <ScriptList />
          ) : (
            <ProductInfoForm />
          )}
        </div>
      </main>
      
      {/* 简洁的页脚 */}
      <Footer />
      
      {/* Toast通知 - Apple风格 */}
      {toastState.isVisible && toastState.type && (
        <Toast
          type={toastState.type}
          message={toastState.message}
          onClose={hideToast}
        />
      )}
    </div>
  );
}

export default App;
