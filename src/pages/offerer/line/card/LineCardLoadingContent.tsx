import RelatedPersonCardLoadingContent from '../../../company/relatedPeople/card/RelatedPersonCardLoadingContent';

interface RelatedPersonCardLoadingContentProps {
  showPersonalInformation?: boolean;
}

function LineCardLoadingContent(props: RelatedPersonCardLoadingContentProps) {
  return (
    <RelatedPersonCardLoadingContent
      showPersonalInformation={props.showPersonalInformation}
    />
  );
}

export default LineCardLoadingContent;
