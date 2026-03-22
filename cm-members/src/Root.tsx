import "./index.css";
import { Composition } from "remotion";
import { PhoneTemplate, phoneSchema } from "./PhoneTemplate";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MembersClubCM"
        component={PhoneTemplate}
        durationInFrames={3600}
        fps={60}
        width={1920}
        height={1080}
        schema={phoneSchema}
        defaultProps={{}}
      />
    </>
  );
};
