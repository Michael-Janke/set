type PublicUser = {
  name: string;
  id: string;
  color: string[];
  ready: boolean;
  sets: number;
  fails: number;
  selecting: boolean;
  connected: boolean;
  owner: boolean;
};

export default PublicUser;
