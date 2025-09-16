import { store } from '../../configurations/reduxConfig';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
