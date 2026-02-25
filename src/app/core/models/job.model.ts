export interface Job {
  id: string;
  title: string;
  description: string;
  company: {
    display_name: string;
  };
  location: {
    display_name: string;
    area: string[];
  };
  salary_min?: number;
  salary_max?: number;
  contract_type?: string; // 'permanent', 'contract', etc.
  redirect_url: string;
  created: string;
  category?: {
    label: string;
    tag: string;
  };
}

export interface AdzunaResponse {
  count: number;
  mean: number;
  results: Job[];
  __CLASS__: string;
}

export interface JobSearchCriteria {
  what?: string; // Mots-clés (ex: "Angular Developer")
  where?: string; // Localisation (ex: "London")
  country?: string; // Code pays (ex: "gb", "fr", "us")
  page?: number;
  results_per_page?: number;
}
