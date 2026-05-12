import { TextOutput } from '@ifrc-go/ui';

import ImminentEventListItem from '#components/ImminentEventListItem';
import { type RiskApiResponse } from '#utils/restRequest';

import { type RiskEventListItemProps } from '../../../RiskImminentEventMap';

type ImminentEventResponse = RiskApiResponse<'/api/v1/pdc/'>;
type EventItem = NonNullable<ImminentEventResponse['results']>[number];

type Props = RiskEventListItemProps<EventItem>;

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
            heading={hazard_name ?? '--'}
            description={(
                <TextOutput
                    label="Started on"
                    value={start_date}
                    valueType="date"
                />
            )}
            expanded={expanded}
            eventId={id}
            onExpandClick={onExpandClick}
        >
            {children}
        </ImminentEventListItem>
    );
}

export default EventListItem;
