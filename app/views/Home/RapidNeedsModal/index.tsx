import {
    Chip,
    Container,
    DateOutput,
    ListView,
    Message,
    Modal,
    TextOutput,
} from '@ifrc-go/ui';
import { resolveToComponent } from '@ifrc-go/ui/utils';
import { isDefined } from '@togglecorp/fujs';
import { gql } from 'urql';

import {
    type KoboRapidNeedsQuery,
    useKoboRapidNeedsQuery,
} from '#generated/types/graphql';

import styles from './styles.module.css';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const KOBO_RAPID_NEEDS_QUERY = gql`
    query KoboRapidNeeds($id: ID!) {
        koboRapidNeeds(id: $id) {
            id
            index
            title
            emergencyCode
            submissionTime
            reportingBranch
            region
            zone
            woreda
            kebele
            peopleInNeed
            peopleAffected
            peopleDisplaced
            peopleAffectedNonDisplaced
            topAffectedGroups
            prioritySectors
            vulnerableGroups
            responseModalities
        }
    }
`;

type RapidNeeds = NonNullable<KoboRapidNeedsQuery['koboRapidNeeds']>;

interface ChipGroupProps {
    label: string;
    items: readonly string[] | undefined;
}

function ChipGroup(props: ChipGroupProps) {
    const { label, items } = props;
    if (!items || items.length === 0) {
        return null;
    }
    return (
        <Container
            heading={label}
            headingLevel={6}
            spacing="xs"
        >
            <div className={styles.chips}>
                {items.map((item) => (
                    <Chip
                        key={item}
                        name={item}
                        label={item}
                        variant="tertiary"
                    />
                ))}
            </div>
        </Container>
    );
}

interface Props {
    id: string;
    onClose: () => void;
}

function RapidNeedsModal(props: Props) {
    const { id, onClose } = props;

    const [{ data, fetching }] = useKoboRapidNeedsQuery({
        variables: { id },
    });
    const rna: RapidNeeds | null | undefined = data?.koboRapidNeeds;

    const locationParts = [
        rna?.kebele,
        isDefined(rna?.woreda) ? `${rna?.woreda} woreda` : undefined,
        rna?.zone,
    ].filter(isDefined);

    const headerDescription = rna && (
        <ListView
            layout="block"
            spacing="3xs"
        >
            <span className={styles.pretitle}>
                Emergency Rapid Needs Assessment · ERCS EOC
            </span>
            <span className={styles.breadcrumb}>
                {[rna.emergencyCode, `RNA-${rna.index}`].filter(isDefined).join(' / ')}
            </span>
            {isDefined(rna.submissionTime) && (
                <span className={styles.submitted}>
                    {resolveToComponent(
                        'Submitted {date}{location}{branch}',
                        {
                            date: <DateOutput value={rna.submissionTime} />,
                            location: locationParts.length > 0 ? ` · ${locationParts.join(', ')}` : '',
                            branch: rna.reportingBranch ? ` · ${rna.reportingBranch} branch` : '',
                        },
                    )}
                </span>
            )}
        </ListView>
    );

    return (
        <Modal
            heading={rna?.title ?? 'Rapid Needs Assessment'}
            headerDescription={headerDescription}
            headingLevel={2}
            onClose={onClose}
            size="lg"
            pending={fetching}
            spacing="lg"
        >
            {!fetching && !rna && (
                <Message
                    title="Assessment not available"
                    description="This rapid needs assessment could not be loaded."
                />
            )}
            {rna && (
                <ListView
                    layout="block"
                    spacing="lg"
                >
                    <ListView
                        layout="grid"
                        numPreferredGridColumns={4}
                    >
                        <TextOutput
                            label="People in need"
                            value={rna.peopleInNeed}
                            valueType="number"
                            textSize="lg"
                            strongValue
                            withBlockLayout
                            withBackground
                        />
                        <TextOutput
                            label="Affected population"
                            value={rna.peopleAffected}
                            valueType="number"
                            textSize="lg"
                            strongValue
                            withBlockLayout
                            withBackground
                        />
                        <TextOutput
                            label="Of which displaced"
                            value={rna.peopleDisplaced}
                            valueType="number"
                            textSize="lg"
                            strongValue
                            withBlockLayout
                            withBackground
                        />
                        <TextOutput
                            label="Affected non-displaced"
                            value={rna.peopleAffectedNonDisplaced}
                            valueType="number"
                            textSize="lg"
                            strongValue
                            withBlockLayout
                            withBackground
                        />
                    </ListView>

                    <Container
                        heading="Assessment details"
                        headingLevel={5}
                        withHeaderBorder
                        spacing="sm"
                    >
                        <ListView
                            layout="grid"
                            numPreferredGridColumns={3}
                        >
                            <TextOutput label="Related emergency" value={rna.emergencyCode} valueType="text" withBlockLayout />
                            <TextOutput label="Region" value={rna.region} valueType="text" withBlockLayout />
                            <TextOutput label="Zone" value={rna.zone} valueType="text" withBlockLayout />
                            <TextOutput label="Woreda" value={rna.woreda} valueType="text" withBlockLayout />
                            <TextOutput label="Kebele(s)" value={rna.kebele} valueType="text" withBlockLayout />
                            <TextOutput label="Reporting ERCS branch" value={rna.reportingBranch} valueType="text" withBlockLayout />
                        </ListView>
                    </Container>

                    <Container
                        heading="Priorities identified"
                        headingLevel={5}
                        withHeaderBorder
                        spacing="md"
                    >
                        <ListView
                            layout="grid"
                            numPreferredGridColumns={2}
                        >
                            <ChipGroup label="Top affected groups" items={rna.topAffectedGroups} />
                            <ChipGroup label="Priority sectors" items={rna.prioritySectors} />
                            <ChipGroup
                                label="Vulnerable groups requiring immediate assistance"
                                items={rna.vulnerableGroups}
                            />
                            <ChipGroup label="Favoured response modalities" items={rna.responseModalities} />
                        </ListView>
                    </Container>
                </ListView>
            )}
        </Modal>
    );
}

export default RapidNeedsModal;
