import { TextOutput } from '@ifrc-go/ui';

import ImminentEventListItem from '#components/ImminentEventListItem';
import { type RiskApiResponse } from '#utils/restRequest';

import { type RiskEventListItemProps } from '../../../RiskImminentEventMap';

type ImminentEventResponse = RiskApiResponse<'/api/v1/gdacs/'>;
type GdacsItem = NonNullable<ImminentEventResponse['results']>[number];

type Props = RiskEventListItemProps<GdacsItem>;

function EventListItem(props: Props) {
    const {
        data: {
            id,
            hazard_name,
            start_date,
        },
        expanded,
        onExpandClick,
        className,
        children,
    } = props;

    return (
        <ImminentEventListItem
            className={className}
            eventId={id}
            expanded={expanded}
            onExpandClick={onExpandClick}
            heading={hazard_name ?? '--'}
            description={(
                <TextOutput
                    label="Started On"
                    value={start_date}
                    valueType="date"
                    textSize="sm"
                />
            )}
        >
            {children}
        </ImminentEventListItem>
    );
}

export default EventListItem;
