import {
  ButtonItem,
} from "decky-frontend-lib";

import { VFC } from "react";
import {
  AppActions,
  ProviderIdentity,
  useStateContext,
} from "../context/context";
import * as python from "./../python";

type MediaProviderProps = {
  currentProvider: string;
};

export const MediaProviderButton: VFC<MediaProviderProps> = (
  props: MediaProviderProps
) => {
  const { state, dispatch } = useStateContext();

  const getDisplayNameForProvider = (provider: string) => {
    const providerIndex = state.providersToIdentity.findIndex(
      (mapping: ProviderIdentity) => mapping.provider == provider
    );

    if (providerIndex < 0)
      return provider.replace("org.mpris.MediaPlayer2.", "");

    return state.providersToIdentity[providerIndex].name;
  };

  const handleOnClick = () => {
    if (state.providers.length === 0) return;
    
    const currentIndex = state.providers.findIndex(p => p === props.currentProvider);
    const nextIndex = (currentIndex + 1) % state.providers.length;
    const nextProvider = state.providers[nextIndex];
    
    python.setMediaPlayer(nextProvider);
    dispatch({
      type: AppActions.SetCurrentServiceProvider,
      value: nextProvider,
    });
  };

  return (
    <ButtonItem layout="below" bottomSeparator='none' onClick={handleOnClick}>
      {props.currentProvider == ""
        ? "No Media Player Found"
        : getDisplayNameForProvider(props.currentProvider)}
    </ButtonItem>
  );
};
