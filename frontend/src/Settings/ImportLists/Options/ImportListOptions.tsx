import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import AppState from 'App/State/AppState';
import Alert from 'Components/Alert';
import FieldSet from 'Components/FieldSet';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import { inputTypes, kinds } from 'Helpers/Props';
import { clearPendingChanges } from 'Store/Actions/baseActions';
import {
  fetchImportListOptions,
  saveImportListOptions,
  setImportListOptionsValue,
} from 'Store/Actions/settingsActions';
import createSettingsSectionSelector from 'Store/Selectors/createSettingsSectionSelector';
import translate from 'Utilities/String/translate';

const SECTION = 'importListOptions';
const cleanLibraryLevelOptions = [
  { key: 'disabled', value: () => translate('Disabled') },
  { key: 'logOnly', value: () => translate('LogOnly') },
  { key: 'keepAndUnmonitor', value: () => translate('KeepAndUnmonitorMovie') },
  { key: 'removeAndKeep', value: () => translate('RemoveMovieAndKeepFiles') },
  {
    key: 'removeAndDelete',
    value: () => translate('RemoveMovieAndDeleteFiles'),
  },
];

function createImportListOptionsSelector() {
  return createSelector(
    (state: AppState) => state.settings.advancedSettings,
    createSettingsSectionSelector(SECTION),
    (advancedSettings, sectionSettings) => {
      return {
        advancedSettings,
        save: sectionSettings.isSaving,
        ...sectionSettings,
      };
    }
  );
}

interface ImportListOptionsPageProps {
  setChildSave(saveCallback: () => void): void;
  onChildStateChange(payload: unknown): void;
}

function ImportListOptions(props: ImportListOptionsPageProps) {
  const { setChildSave, onChildStateChange } = props;

  const {
    isSaving,
    hasPendingChanges,
    advancedSettings,
    isFetching,
    error,
    settings,
    hasSettings,
  } = useSelector(createImportListOptionsSelector());

  const { listSyncLevel, ignoreRelatedCollectionMoviesDuringListSync } =
    settings;

  const dispatch = useDispatch();

  const onInputChange = useCallback(
    ({ name, value }: { name: string; value: unknown }) => {
      // @ts-expect-error 'setImportListOptionsValue' isn't typed yet
      dispatch(setImportListOptionsValue({ name, value }));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(fetchImportListOptions());
    setChildSave(() => dispatch(saveImportListOptions()));

    return () => {
      dispatch(clearPendingChanges({ section: SECTION }));
    };
  }, [dispatch, setChildSave]);

  useEffect(() => {
    onChildStateChange({
      isSaving,
      hasPendingChanges,
    });
  }, [onChildStateChange, isSaving, hasPendingChanges]);

  const translatedLevelOptions = cleanLibraryLevelOptions.map(
    ({ key, value }) => {
      return {
        key,
        value: value(),
      };
    }
  );

  return advancedSettings ? (
    <FieldSet legend={translate('Options')}>
      {isFetching ? <LoadingIndicator /> : null}

      {!isFetching && error ? (
        <Alert kind={kinds.DANGER}>{translate('ListOptionsLoadError')}</Alert>
      ) : null}

      {hasSettings && !isFetching && !error ? (
        <Form>
          <FormGroup advancedSettings={advancedSettings} isAdvanced={true}>
            <FormLabel>{translate('CleanLibraryLevel')}</FormLabel>
            <FormInputGroup
              type={inputTypes.SELECT}
              name="listSyncLevel"
              values={translatedLevelOptions}
              helpText={translate('ListSyncLevelHelpText')}
              onChange={onInputChange}
              {...listSyncLevel}
            />
          </FormGroup>
          <FormGroup advancedSettings={advancedSettings} isAdvanced={true}>
            <FormLabel>
              {translate('IgnoreRelatedCollectionMoviesDuringListSync')}
            </FormLabel>
            <FormInputGroup
              type={inputTypes.CHECK}
              name="ignoreRelatedCollectionMoviesDuringListSync"
              helpText={translate(
                'IgnoreRelatedCollectionMoviesDuringListSyncHelpText'
              )}
              onChange={onInputChange}
              {...ignoreRelatedCollectionMoviesDuringListSync}
            />
          </FormGroup>
        </Form>
      ) : null}
    </FieldSet>
  ) : null;
}

export default ImportListOptions;
