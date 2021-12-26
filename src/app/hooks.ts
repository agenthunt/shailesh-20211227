import {useDimensions} from '@react-native-community/hooks';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import type {AppDispatch, RootState} from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDimensions = () => {
  const {height: windowHeight, width: windowWidth} = useDimensions().window;

  const isLandscape = windowWidth > windowHeight;
  const isDesktop = isLandscape && windowWidth > 720;

  return {
    windowWidth,
    windowHeight,
    isLandscape,
    isDesktop,
  };
};
