import { useEffect, useRef } from 'react';

/**
 * 오버레이/탭 전환 시 history.pushState를 활용해
 * 뒤로가기 버튼이 페이지 이탈 대신 닫기 동작을 수행하도록 한다.
 *
 * open 시 push, close 시 back or pop.
 * popstate가 먼저 발생하면(유저가 뒤로가기) onClose 콜백 호출.
 */
export function useBackHandler(isOpen: boolean, onClose: () => void) {
  const pushed = useRef(false);

  // popstate → 유저가 뒤로가기를 눌렀을 때
  useEffect(() => {
    if (!isOpen) return;

    const handler = () => {
      if (pushed.current) {
        pushed.current = false;
        onClose();
      }
    };

    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, [isOpen, onClose]);

  // isOpen 변화에 따라 push / back
  useEffect(() => {
    if (isOpen && !pushed.current) {
      history.pushState({ overlay: true }, '');
      pushed.current = true;
    }

    // 코드상 close (onClose 호출로 isOpen이 false로 바뀐 경우)
    // → 우리가 push한 history entry를 제거해야 함
    if (!isOpen && pushed.current) {
      pushed.current = false;
      history.back();
    }
  }, [isOpen]);

  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (pushed.current) {
        pushed.current = false;
        history.back();
      }
    };
  }, []);
}
