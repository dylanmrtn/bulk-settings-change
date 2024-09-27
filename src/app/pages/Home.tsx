import React, { useEffect, useState } from 'react';
import {
  Button,
  CodeEditor,
  DataTable,
  Flex,
  FormField,
  Heading,
  Label,
  Modal,
  Paragraph,
  SelectV2,
  SelectV2Filter,
  TableColumn,
  TextInput,
  showToast,
} from '@dynatrace/strato-components-preview';
import { businessEventsClient, EntitiesList, monitoredEntitiesClient, SchemaList, settingsObjectsClient, settingsSchemasClient} from "@dynatrace-sdk/client-classic-environment-v2";
import { InformationIcon, ResetIcon } from '@dynatrace/strato-icons';
import { Link } from 'react-router-dom';
import { getCurrentUserDetails } from '@dynatrace-sdk/app-environment';


export const Home = () => {
  const [entitySelector, setEntitySelector] = useState<string>('');
  const [entities, setEntities] = useState<EntitiesList>();
  const [schemasList, setSchemasList] = useState<SchemaList>();
  const [schema, setSchema] = useState<string>('');
  const [settingsValuesText, setSettingsValuesText] = useState<string>('');
  const [settingsValuesObject, setSettingsValuesObject] = useState<object>({});
  const [showConfirm, setShowConfirm] = useState(false);

  const userDetails= getCurrentUserDetails();

  const entityColumns: TableColumn[] = [
    {
        header: 'Entity Name',
        accessor: 'displayName',
        ratioWidth: 1
    },
    {
        header: 'Entity ID',
        accessor: 'entityId',
        ratioWidth: 1
    }
]
  const queryEntitySelector = async () => {
    const data = await monitoredEntitiesClient.getEntities({
      entitySelector: entitySelector,
      pageSize: 1000
    })

  setEntities(data);
  };

  useEffect(()=> {
    
    async function getSchemas() {
      const data = await settingsSchemasClient.getAvailableSchemaDefinitions();
      setSchemasList(data);
    }
    

    getSchemas();
  }, []);

  const applySettings = (entities:EntitiesList, schema:string, values:object) => {

    entities?.entities?.forEach((entity) => {
      const entityId=entity.entityId ?? '';
      settingsObjectsClient.postSettingsObjects({
        body: [
          {
            schemaId: schema,
            scope: entityId,
            value: values
          }
        ]
      })
    });
  };

  const handleSubmit = () => {
    if (entities && schema && settingsValuesText) {
      setSettingsValuesObject(JSON.parse(settingsValuesText));
      setShowConfirm(true);
    } else {
      showToast({
        type: 'critical',
        title: 'Check Content',
        message: 'Please fill out all 3 fields before submitting!'
      })
    }
  }

  const handleConfirm = () => {
    if(!entities) {
      return;
    }
    applySettings(entities, schema, settingsValuesObject);
    sendAudit(userDetails.email, entitySelector, schema, settingsValuesObject);
    setShowConfirm(false);
    showToast({
      title: 'Success!',
      type: 'success',
      message: (
        <>
          {schema} settings successfully applied to {entities?.totalCount} entities! 
        </>
      ),
    })
    handleReset();
  }
  
  const handleReset = () => {
    setEntitySelector('');
    setEntities(undefined);
    setSchema('');
    setSettingsValuesText('');
    setSettingsValuesObject({});
  }

  const sendAudit = async (user: string, entitySelector: string, schema: string, value: object) => {

    await businessEventsClient.ingest({
      type: "application/json; charset=utf-8",
      body: {
        id: "1",
        "event.provider": "bulk.settings.change",
        "event.type": "settings.change",
        user: user,
        entitySelector: entitySelector,
        entities: entities,
        schema: schema,
        value: value
      }
    });
  }

  return (
    <Flex flexDirection="column" alignItems="center" padding={32}>
      <Flex flexDirection="row" padding={32} paddingBottom={0}>
        <img
          src="./assets/Dynatrace_Logo.svg"
          alt="Dynatrace Logo"
          width={50}
          height={50}
          style={{ paddingBottom: 32 }}
        ></img>

        <Heading>Bulk Settings Change App</Heading>
      </Flex>
      
      <Button as={Link} to="/guide" variant='emphasized'>
        <InformationIcon/>
        How-to-Guide
      </Button>
      <Flex id="Set Up" flexDirection="row" width="100%">
        <Flex id="Entity Select" flexDirection="column" width="100%">
              <FormField label="EntitySelector">
              <TextInput value={entitySelector} onChange={setEntitySelector}/>
              <Button type="submit" variant="emphasized" onClick={queryEntitySelector}>
                  Preview
              </Button>
              </FormField>
              <DataTable
                  columns={entityColumns}
                  data={entities?.entities ?? []}
                  sortable
                  fullWidth
                  height={210}
              ></DataTable>
        </Flex>
        <Flex id="Schema Select" flexDirection="column" width="100%">
          <Label>Select a Schema</Label>
          <SelectV2 value={schema} onChange={setSchema}>
            <SelectV2.Trigger width="full" />
            <SelectV2.Content>
              <SelectV2Filter />
              {schemasList?.items.map((schema) => (
                // eslint-disable-next-line react/jsx-key
                <SelectV2.Option value={schema.schemaId}>{schema.schemaId}</SelectV2.Option>
              ))}
            </SelectV2.Content>
          </SelectV2>
        </Flex>
        <Flex id="Value Set" flexDirection="column" width="100%">
          <Label>Set Settings Values</Label>
            <CodeEditor
              language="json"
              value={settingsValuesText}
              onChange={setSettingsValuesText}
              lineWrap
            />
        </Flex>
      </Flex>
      <Flex id="Submit All" width="100%" paddingTop={64}>
        <Button type="submit" variant="emphasized" width="full" onClick={handleSubmit}>
          Submit
        </Button>
        <Button type="reset" onClick={handleReset}>
          <ResetIcon/>
        </Button>
        <Modal
          title="Confirm Settings Change"
          show={showConfirm}
          onDismiss={() => setShowConfirm(false)}
          size="small"
        >
          <Paragraph>
            Are you sure you want to apply changes to {schema} for {entities?.totalCount} entities?
          </Paragraph>
          <Flex paddingRight={16} paddingTop={16}>
          <Button type="submit" color="critical" variant="emphasized" onClick={() => setShowConfirm(false)}>
            No
          </Button>
          <Button type="submit" color="success" variant="emphasized" onClick={handleConfirm}>
            Yes
          </Button>
          </Flex>
        </Modal>
      </Flex>
      
    </Flex>
  );
};