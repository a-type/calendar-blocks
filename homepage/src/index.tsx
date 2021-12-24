import { globalCss, styled } from '@stitches/react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { DetailedExample } from './examples/DetailedExample';
import { ScrollingExample } from './examples/ScrollingExample';
import { SimpleExample } from './examples/SimpleExample';
import { StylizedExample } from './examples/StylizedExample';
import { GithubLogo } from './GithubLogo';

globalCss({
  body: {
    margin: 0,
    padding: 0,
    fontFamily:
      '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
  html: {
    boxSizing: 'border-box',
    margin: 0,
  },
})();

const now = new Date();

const App = () => {
  const [viewInfo, setViewInfo] = React.useState<{
    month: number;
    year: number;
  }>({
    month: now.getMonth(),
    year: now.getFullYear(),
  });
  const [rangeValue, setRangeValue] = React.useState<{
    start: Date | null;
    end: Date | null;
  }>(() => {
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const fiveWeeksFromNow = new Date(now);
    fiveWeeksFromNow.setDate(fiveWeeksFromNow.getDate() + 35);
    return { start: twoDaysAgo, end: fiveWeeksFromNow };
  });

  const exampleProps = React.useMemo(
    () => ({
      viewInfo,
      rangeValue,
      setViewInfo,
      onRangeValueChange: setRangeValue,
    }),
    [viewInfo, rangeValue, setViewInfo, setRangeValue]
  );

  return (
    <main>
      <CenterSection id="intro">
        <Title>Calendar Blocks</Title>
        <Row>
          <ButtonLink href="https://github.com/a-type/calendar-blocks">
            <GithubLogo />
          </ButtonLink>
          <ButtonLink href="https://a-type.github.io/calendar-blocks/lib">
            TypeDoc
          </ButtonLink>
        </Row>
        <Subtitle>A React calendar input library</Subtitle>
        <Blurb>
          Most React date picker components are good out-of-the-box, but aren't
          flexible enough to allow significant changes in design.
        </Blurb>
        <Blurb>
          Calendar Blocks won't give you a calendar in one line of code, but it
          does let you make all these and more - with full keyboard navigation.
        </Blurb>
      </CenterSection>
      <CenterSection id="examples">
        <ExamplesGrid>
          <ExampleContainer>
            <SimpleExample {...exampleProps} />
          </ExampleContainer>
          <ExampleContainer>
            <DetailedExample {...exampleProps} />
          </ExampleContainer>
          <ExampleContainer>
            <StylizedExample {...exampleProps} />
          </ExampleContainer>
          <ExampleContainer>
            <ScrollingExample {...exampleProps} />
          </ExampleContainer>
        </ExamplesGrid>
      </CenterSection>
      <CenterSection id="docs">
        <ButtonLink href="https://github.com/a-type/calendar-blocks">
          <GithubLogo />
        </ButtonLink>
        <ButtonLink href="https://a-type.github.io/calendar-blocks/lib">
          TypeDoc
        </ButtonLink>
        <ButtonLink href="https://a-type.github.io/calendar-blocks/storybook">
          More examples
        </ButtonLink>
      </CenterSection>
    </main>
  );
};

const Title = styled('h1', {
  fontSize: '4rem',
});

const Subtitle = styled('h2', {
  fontSize: '2rem',
});

const Blurb = styled('p', {
  maxWidth: '80ch',
});

const Row = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  '& > * + *': {
    marginLeft: '2rem',
  },
});

const CenterSection = styled('section', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 40px 40px 20px',
});

const ExamplesGrid = styled('div', {
  padding: '120px 40px',
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridGap: '20px',
  alignItems: 'center',
  justifyContent: 'center',

  '@media (min-width: 768px)': {
    gridTemplateColumns: '1fr 1fr',
  },
});

const ExampleContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const ButtonLink = styled('a', {
  display: 'block',
  textDecoration: 'none',
  color: '#0058aa',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  textAlign: 'center',
  padding: '10px',
  borderRadius: '5px',
  ':hover': {
    backgroundColor: '#e0e0e0',
  },
});

ReactDOM.render(<App />, document.getElementById('root'));
