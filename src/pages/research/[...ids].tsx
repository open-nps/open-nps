import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styled, { ThemeProvider } from 'styled-components';

import { ResearchNotes } from '../../components/ResearchNotes';
import { ResearchComment } from '../../components/ResearchComment';

import { Target, Research } from '../../model';

const Test = styled.h2`
  color: ${props => props.theme.test || '#000'}
`

export const getServerSideProps = async (ctx) => {
  const { connectMongo } = await import('../../util/mongo');
  const [ targetName, researchId ] = ctx.params.ids;

  await connectMongo();

  const target = await Target.findOne({ name: targetName }).lean().populate('configs', { _id: 0 }).lean();
  const search = await Research.findOne({ _id: researchId, target: target._id, concluded: false });

  if (!target || !search) {
    return { notFound: true }
  }

  const configs = target.configs.reduce((a, c) => ({ ...a, [c.key]: c.values }), {});
  return { props: { ...configs, targetName, researchId } };
}

interface Props {
  theme: any, texts: any, targetName: string, researchId: string
}
export default ({ theme, texts, targetName, researchId }: Props) => {
  const [ state, setState ] = useState({ note: null, comment: '' });
  const router = useRouter();
  const setValueForField = (field) => (value) => setState({ ...state, [field]: value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${window.location.origin}/api/research/conclude`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ targetName, researchId, ...state })
    });

    const { ok } = await response.json()

    if (ok) {
      router.push('/research/thanks')
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <form onSubmit={onSubmit}>
        <Test>
          { texts.coreQuestion } {state.note} {state.comment}
        </Test>
        <ResearchNotes setValue={setValueForField('note')}/>
        <ResearchComment value={state.comment} setValue={setValueForField('comment')}/>
        <button>
          Enviar
        </button>
      </form>
    </ThemeProvider>
  )
};;
