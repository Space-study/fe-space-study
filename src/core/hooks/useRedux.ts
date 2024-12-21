import {useDispatch, useSelector} from 'react-redux'
import {AppDispatch, RootState} from '../redux/store'

// Custom typed hooks for dispatch and selector
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = <T>(selector: (state: RootState) => T): T => useSelector(selector)
