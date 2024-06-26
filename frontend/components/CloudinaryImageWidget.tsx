"use client";

import FullButton from "./Buttons/FullButton";
import { CldUploadWidget } from "next-cloudinary";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { FC } from "react";

interface Props {
  onImageUpload: (e: string) => void;
}

const ImageUpload: FC<Props> = ({ onImageUpload }) => {
  const t = useTranslations();
  const { locale } = useParams();

  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_IMAGE_UPLOAD_PRESET}
      options={{
        sources: ["local", "camera"],
        cropping: true,
        croppingAspectRatio: 0.8,
        resourceType: "image",
        clientAllowedFormats: ["image"],
        showSkipCropButton: false,
        multiple: false,
        language: typeof locale === "string" ? locale : "en",
        maxFiles: 1,
        styles: {
          palette: {
            window: "#FFF",
            windowBorder: "#90A0B3",
            tabIcon: "#0E2F5A",
            menuIcons: "#5A616A",
            textDark: "#000000",
            textLight: "#FFFFFF",
            link: "#cecaff",
            action: "#cecaff",
            inactiveTabIcon: "#0E2F5A",
            error: "#F44235",
            inProgress: "#cecaff",
            complete: "#20B832",
            sourceBg: "#fff0eb",
          },
          frame: {
            background: "#0E2F5B99",
          },
          fonts: {
            "'Karla', cursive":
              "https://fonts.googleapis.com/css2?family=Karla",
          },
        },
        text: {
          en: {
            or: "Or",
            back: "Back",
            advanced: "Advanced",
            close: "Close",
            no_results: "No results",
            search_placeholder: "Search files",
            about_uw: "About the Upload Widget",
            search: {
              placeholder: "Search...",
              reset: "Reset search",
            },
            menu: {
              files: "My Files",
              web: "Web Address",
              camera: "Camera",
              gsearch: "Image Search",
              gdrive: "Google Drive",
              dropbox: "Dropbox",
              facebook: "Facebook",
              instagram: "Instagram",
              shutterstock: "Shutterstock",
              getty: "gettyimages",
              istock: "iStock",
              unsplash: "Unsplash",
            },
            selection_counter: {
              selected: "Selected",
            },
            actions: {
              upload: "Upload",
              next: "Next",
              clear_all: "Clear all",
              log_out: "Log out",
            },
            notifications: {
              general_error: "An error has occurred.",
              general_prompt: "Are you sure?",
              limit_reached: "No more files can be selected.",
              invalid_add_url: "The URL must be valid.",
              invalid_public_id: "Public ID cannot contain \\,,&,#,%,<,>.",
              no_new_files: "The files have already been uploaded.",
              image_purchased: "Image Purchased",
              video_purchased: "Video Purchased",
              purchase_failed: "Purchase failed. Please try again.",
              service_logged_out: "Service logged out due to error",
              great: "Great",
              image_acquired: "Image Acquired",
              video_acquired: "Video Acquired",
              acquisition_failed: "Acquisition failed. Please try again.",
            },
            advanced_options: {
              public_id_ph: "Public ID",
              tags_ph: "Add a tag",
              add_new: "Add a new tag:",
              upload_preset_placeholder: "Upload Preset",
              upload_preset_no_options: "No upload preset",
            },
            landscape_overlay: {
              title: "Landscape mode isn't supported",
              description:
                "Rotate your device back to portrait mode to continue.",
            },
            aria_label: {
              close: "Close",
              back: "Back",
            },
            queue: {
              title: "Upload Queue",
              title_uploading_with_counter: "Uploading {{num}} assets",
              title_processing_with_counter: "Processing {{num}} assets",
              title_uploading_processing_with_counters:
                "Uploading {{uploading}} assets, processing {{processing}} assets",
              title_uploading: "Uploading assets",
              mini_title: "Uploaded",
              mini_title_uploading: "Uploading",
              mini_title_processing: "Processing",
              show_completed: "Show completed",
              retry_failed: "Retry failed",
              abort_all: "Abort all",
              upload_more: "Upload more",
              done: "Done",
              mini_upload_count: "{{num}} uploaded",
              mini_failed: "{{num}} failed",
              statuses: {
                uploading: "Uploading...",
                processing: "Processing...",
                timeout:
                  "A large file is currently being uploaded. It might take a while to appear in your product environment.",
                error: "Error",
                uploaded: "Done",
                aborted: "Aborted",
              },
            },
            uploader: {
              filesize: {
                na: "N/A",
                b: "{{size}} Bytes",
                k: "{{size}} KB",
                m: "{{size}} MB",
                g: "{{size}} GB",
                t: "{{size}} TB",
              },
              errors: {
                file_too_large:
                  "File size ({{size}}) exceeds maximum allowed ({{allowed}})",
                max_dimensions_validation:
                  "Image dimensions ({{width}}X{{height}}) are bigger than the maximum allowed: ({{maxWidth}}X{{maxHeight}})",
                min_dimensions_validation:
                  "Image dimensions ({{width}}X{{height}}) are smaller than the minimum required: ({{minWidth}}X{{minHeight}})",
                unavailable: "NA",
                max_number_of_files: "Maximum number of files exceeded",
                allowed_formats: "File format not allowed",
                max_file_size: "File is too large",
                min_file_size: "File is too small",
              },
              close_mid_upload: "There are running uploads. Click OK to abort.",
            },
            crop: {
              title: "Crop",
              crop_btn: "Crop",
              skip_btn: "Skip",
              reset_btn: "Reset",
              close_btn: "Yes",
              close_prompt: "Closing will cancel all uploads, Are you sure?",
              image_error: "Error loading image",
              image_data_error:
                "either the file size exceeds the browser limit or the file may be corrupt.",
              corner_tooltip: "Drag corner to resize",
              handle_tooltip: "Drag handle to resize",
            },
            camera: {
              capture: "Capture",
              cancel: "Cancel",
              take_pic: "Take a picture and upload it",
              explanation:
                "Make sure that your camera is connected and that your browser allows camera capture. When ready, click Capture.",
              camera_error: "Failed to access camera",
              retry: "Retry Camera",
              file_name: "Camera_{{time}}",
            },
            dropbox: {
              no_auth_title: "Upload files from your Dropbox account.",
              no_auth_action: "Connect to Dropbox",
              no_photos: "No Photos",
              no_files: "No Files",
              root_crumb: "Root",
              list_headers: {
                select: "Select",
                name: "Name",
                modified: "Modified",
              },
              menu: {
                browse: "Browse",
                recent: "Recent",
              },
              authenticating: "Authenticating...",
            },
            facebook: {
              no_photos: "No photos...",
              no_auth_title: "Upload files from your Facebook account.",
              no_auth_action: "Connect to Facebook",
              no_auth_statement:
                "We will not post anything without your permission.",
              album_subtitle: "{{count}} photos",
              menu: {
                uploaded: "Your Photos",
                tagged: "Photos of You",
                albums: "Albums",
              },
            },
            google_drive: {
              no_auth_title: "Upload files from your Google Drive.",
              no_auth_action: "Connect to Google Drive",
              search: {
                placeholder: "Search...",
                reset: "Reset search",
              },
              grid: {
                folders: "Folders",
                files: "Files",
                empty_folder: "This folder is empty.",
              },
              recent: "Recent",
              starred: "Starred",
              my_drive: "My Drive",
              shared_drive: "Shared drives",
              search_results: "Search results",
              shared_with_me: "Shared with me",
              name: "Name",
              modifiedTime: "Last modified",
              modifiedByMeTime: "Last modified by me",
              viewedByMeTime: "Last opened by me",
              notifications: {
                retrieve_failed:
                  "Failed to retrieve upload data from Google Drive.",
              },
            },
            image_search: {
              main_title: "Image Search",
              inputPlaceholder: "Search for images",
              customPlaceholder: "Search {{site}}",
              show_options: "Show Options",
              hide_options: "Hide Options",
              filters_title: "Site",
              all: "all",
              rights: "Usage rights:",
              rights_options: {
                not_filtered: "not filtered by licence",
                free: "free to use or share",
                free_com: "free to use or share, even commercially",
                free_mod: "free to use share or modify",
                free_mod_com: "free to use, share or modify, even commercially",
              },
              search_error: "Search failed, please try again.",
            },
            instagram: {
              no_auth_title: "Upload photos from your Instagram account.",
              no_auth_action: "Connect to Instagram",
              header_title: "Your Recent Instagram Photos",
              authenticating: "Authenticating...",
            },
            local: {
              browse: "Browse",
              dd_title_single: "Drag and Drop an asset here",
              dd_title_multi: "Drag and Drop assets here",
              drop_title_single: "Drop a file to upload",
              drop_title_multiple: "Drop files to upload",
            },
            shutterstock: {
              no_auth_title: "Upload assets from your Shutterstock account.",
              toggle_filters_button: "Filters",
              no_auth_action: "Connect to Shutterstock",
              authenticating: "Authenticating...",
              statement:
                "Shutterstock offers the best quality, royalty free stock images, photos, vectors, illustrations, videos and music for nearly any application.",
              reg_link_text: "Click here to create a Shutterstock account",
              next_btn: "Next",
              media_types: {
                images: "Images",
                videos: "Videos",
              },
              filters: {
                more_label: "More",
                sort_options: {
                  label: "Sort by",
                  newest: "New",
                  relevance: "Relevant",
                  popular: "Popular",
                  random: "Random",
                },
                people: {
                  label: "People",
                  only_images_with_people: "Only images with people",
                  only_videos_with_people: "Only videos with people",
                },
                gender: {
                  label: "Gender",
                  male: "Male",
                  female: "Female",
                  both: "Both",
                },
                size: {
                  label: "Size",
                  small: "Small",
                  medium: "Medium",
                  large: "Large",
                },
                clear: "clear",
                orientation: {
                  label: "Orientation",
                  horizontal: "Horizontal",
                  vertical: "Vertical",
                },
                color: "Color",
                colors: {
                  red: "red",
                  orange: "orange",
                  amber: "amber",
                  yellow: "yellow",
                  lime: "lime",
                  green: "green",
                  teal: "teal",
                  turquoise: "turquoise",
                  aqua: "aqua",
                  azure: "azure",
                  blue: "blue",
                  purple: "purple",
                  orchid: "orchid",
                  magenta: "magenta",
                },
                safe: "Safe",
                all_categories: "All Categories",
                types: {
                  all: "All image types",
                  illustration: "Illustration",
                  photo: "Photo",
                  vector: "Vector",
                },
                duration: {
                  label: "Duration",
                  short: "Short",
                  short_tip: "< 4 minutes",
                  long: "Long",
                  long_tip: "> 20 minutes",
                },
                resolution: {
                  label: "Resolution",
                  standard_definition: "SD",
                  standard_definition_tip: "Standard Definition",
                  high_definition: "HD",
                  high_definition_tip: "High Definition",
                  "4k": "4k",
                  "4k_tip": "4k",
                },
              },
              filter_summary: {
                label: "Filters: {{- summary}}",
                gender: "only {{value}}",
                people: "with {{value}} people",
                color: "color: {{value}}",
                category: "in {{- value}}",
                unsafe: "unsafe",
              },
              purchase_page: {
                purchase_btn_label: "Purchase",
                plans: {
                  label: "Select Plan",
                  years: "years",
                  days: "days",
                  expired: "expired",
                  exceeded: "exceeded",
                  manage_plans: "Manage your Shutterstock plans...",
                  no_plan: "Your current plan does not include ",
                },
                format_and_size: {
                  label: "Select Format & Size",
                },
                aspect_ratio: "Aspect Ratio",
                author: "Author",
                description: "Description",
                button_label: {
                  purchase: "Purchase",
                  acquire: "Purchase",
                  next: "Next",
                  upload: "Upload",
                  purchasing: "Purchasing...",
                  downloading: "Downloading...",
                },
                button_description: {
                  next: "You already own this {{assetType}} Click Next to continue",
                  upload:
                    "You already own this {{assetType}} Click Upload to continue",
                  purchasing: "Purchasing - This may take a few seconds...",
                  downloading: "Downloading - This may take a few seconds...",
                },
                duration: "Duration",
                fps: "FPS",
                sizes: {
                  vector_eps: "Vector",
                  small_jpg: "Small",
                  medium_jpg: "Medium",
                  huge_jpg: "Huge",
                  web: "Web",
                  sd: "SD",
                  hd: "HD",
                  "4k": "4K",
                },
                file_limit_exceeded:
                  "Some options have exceeded the upload file-size limit.",
                time_left: "{{time}} left",
              },
              purchase_preview: {
                loading_preview: "Loading preview",
                open_in_new_window: "Open in new window",
              },
              dictionary: {
                image: "image",
                video: "video",
              },
              home_page: {
                results_header: "Popular",
                categories_header: "Categories",
              },
              search: {
                placeholder: "Search...",
                reset: "Reset search",
              },
            },
            getty: {
              no_auth_title: "Upload assets from your Getty Images account.",
              no_auth_action: "Connect to Getty Images",
              no_auth_statement:
                "Find the perfect royalty-free image for your next project from the world's best photo library of creative stock photos, vector art illustrations and stock.",
              reg_link_text: "Click here to create a Getty Images account",
              select: "Select",
              search: {
                placeholder: "Search...",
                reset: "Reset search",
              },
              media_types: {
                images: "Images",
                videos: "Videos",
              },
              media_types_singular: {
                images: "image",
                videos: "video",
              },
              popular_categories: "Popular categories",
              diversity_categories: "Diversity categories",
              filters: {
                toggle_filters_button: "Filters",
                clear: "Clear",
                available_for_creative_images:
                  "Filter is available only for creative images",
                available_for_creative_videos:
                  "Filter is available only for creative videos",
                available_for_creative_editorial_videos:
                  "Filter is available only for creative or editorial images",
                sort_options: {
                  label: "Sort by",
                  newest: "Newest",
                  best_match: "Best match",
                  most_popular: "Most popular",
                  random: "Random",
                },
                orientation: {
                  label: "Orientation",
                  horizontal: "Horizontal",
                  vertical: "Vertical",
                  square: "Square",
                  panoramic_horizontal: "Panoramic horizontal",
                  panoramic_vertical: "Panoramic vertical",
                },
                number_of_people: {
                  label: "Number of People",
                  none: "None",
                  one: "One",
                  two: "Two",
                  group: "Group",
                },
                license: {
                  label: "License Type",
                  creative: "Creative",
                  editorial: "Editorial",
                  all: "All",
                },
                license_model: {
                  label: "License model",
                  rightsready: "Rights-ready",
                  royaltyfree: "Royality-free",
                  all: "RF and RR",
                },
                colors: {
                  label: "Colors",
                },
                age_of_people: {
                  label: "Age",
                  baby: "Baby",
                  child: "Child",
                  teenager: "Teenager",
                  young_adult: "Young adult",
                  adult: "Adult",
                  adults_only: "Adults only",
                  mature_adult: "Mature adult",
                  senior_adult: "Senior adult",
                },
                ethnicity: {
                  label: "Ethnicity",
                  black: "Black",
                  caucasian: "Caucasian",
                  east_asian: "East Asian",
                  hispanic_latino: "Hispanic/LatinX",
                  middle_eastern: "Middle Eastern",
                  mixed_race_person: "Mixed Race Person",
                  multiethnic_group: "Multi-Ethnic gGroup",
                  native_american_first_nations:
                    "Native American/First Nations",
                  pacific_islander: "Pacific Islander",
                  south_asian: "South Asian",
                  southeast_asian: "Southeast Asian",
                },
                resolution: {
                  label: "Resolution",
                },
                duration: {
                  label: "Duration",
                },
                more: {
                  label: "More",
                  safe: "Safe (Exclude nudity)",
                  exclude_editorial_use_only: "Exclude 'Editorial use only'",
                  embed_content_only: "Embeddable images",
                },
                minimumSize: {
                  label: "Image resolution",
                  large: "12 MP and larger",
                  x_large: "16 MP and larger",
                  xx_large: "21 MP and larger",
                },
                compositions: {
                  label: "Image style",
                  abstract: "Abstract",
                  portrait: "Portrait",
                  close_up: "Close-up",
                  sparse: "Sparse",
                  cut_out: "Cut out",
                  full_frame: "Full frame",
                  copy_space: "Copy space",
                  macro: "Macro",
                  still_life: "Still life",
                },
                videoCompositions: {
                  label: "Composition",
                  close_up: "Close-up",
                  candid: "Candid",
                  looking_at_camera: "Looking at camera",
                },
                frameRates: {
                  label: "Frame Rate",
                },
                viewpoint: {
                  label: "Viewpoint",
                  lockdown: "Lockdown",
                  panning: "Panning",
                  tracking_shot: "Tracking shot",
                  aerial_view: "Aerial view",
                  high_angle_view: "High angle view",
                  low_angle_view: "Low angle view",
                  tilt: "Tilt",
                  point_of_view: "Point of view",
                },
                imageTechniques: {
                  label: "Image Technique",
                  realtime: "Realtime",
                  time_lapse: "Time lapse",
                  slow_motion: "Slow motion",
                  color: "Color",
                  black_and_white: "Black and white",
                  animation: "Animation",
                  selective_focus: "Selective focus",
                },
                summary: {
                  label: "Filters",
                  color: "color: {{color}}",
                  number_of_people: {
                    none: "Without people",
                    one: "With one person",
                    two: "With two people",
                    group: "With group people",
                  },
                  license_type: {
                    all: "All types",
                    creative: "Creative",
                    editorial: "Editorial",
                  },
                  orientations: {
                    square: "Square",
                    vertical: "Vertical",
                    horizontal: "Horizontal",
                    panoramic_horizontal: "Panoramic horizontal",
                    panoramic_vertical: "Panoramic vertical",
                  },
                  minimum_size: {
                    large: "12 MP and larger",
                    x_large: "16 MP and larger",
                    xx_large: "21 MP and larger",
                  },
                  compositions: {
                    abstract: "Abstract",
                    portrait: "Portrait",
                    close_up: "Close-up",
                    sparse: "Sparse",
                    cut_out: "Cut out",
                    full_frame: "Full frame",
                    copy_space: "Copy space",
                    macro: "Macro",
                    still_life: "Still life",
                  },
                  image_techniques: {
                    realtime: "Realtime",
                    time_lapse: "Time lapse",
                    slow_motion: "Slow motion",
                    color: "Color",
                    black_and_white: "Black and white",
                    animation: "Animation",
                    selective_focus: "Selective focus",
                  },
                  viewpoints: {
                    lockdown: "Lockdown",
                    panning: "Panning",
                    tracking_shot: "Tracking shot",
                    aerial_view: "Aerial view",
                    high_angle_view: "High angle view",
                    low_angle_view: "Low angle view",
                    tilt: "Tilt",
                    point_of_view: "Point of view",
                  },
                  video_compositions: {
                    close_up: "Close-up",
                    candid: "Candid",
                    looking_at_camera: "Looking at camera",
                  },
                  license_models: {
                    rightsready: "Rights-ready",
                    royaltyfree: "Royality-free",
                    all: "RF and RR",
                  },
                  exclude_nudity: "Safe (Exclude nudity)",
                  exclude_editorial_use_only: "Exclude 'Editorial use only'",
                  embed_content_only: "Embeddable images",
                },
              },
              purchase: {
                select_plan: "Select Plan",
                select_format: "Select Format & Size",
                manage_plans: "Manage Plans",
                format: "Select Format & Size",
                credit: "Credit",
                credits: "Credits",
                plan_exceeded: "Plan Exceeded",
                size: {
                  x_small: "X Small",
                  small: "Small",
                  medium: "Medium",
                  large: "Large",
                  x_large: "X Large",
                  xx_large: "XX Large",
                  vector: "Vector",
                },
                credits_remaining: "credits remainings",
                media_type_not_included:
                  "Your current plan does not include this {{mediaType}}",
                images: "images",
                videos: "videos",
                days_left: "days left",
                credits_balance_too_small: "Your credits balance is too small",
                collection: "Collection",
                item_id: "Creative #",
                license_type: "License type",
                release_info: "Release info",
                location: "Location",
                description: "Description",
                rightsmanaged: "Rights-Managed/Rights-Ready",
                royaltyfree: "Royalty-Free",
                cost: "Cost",
              },
              buttons: {
                next: "Next",
                upload: "Upload",
                purchase: "Acquire",
              },
            },
            istock: {
              no_auth_title:
                "Upload files from your iStock by Getty Images account.",
              no_auth_action: "Connect to iStock",
              no_auth_statement:
                "iStock by Getty Images is one of the world's leading stock content marketplaces, offering millions of hand-picked premium images at ridiculously low prices that you can only get from us.",
              reg_link_text:
                "Click here to create an iStock by Getty Images account",
              select: "Select",
              search: {
                placeholder: "Search...",
                reset: "Reset search",
              },
              media_types: {
                images: "Images",
                videos: "Videos",
              },
              media_types_singular: {
                images: "image",
                videos: "video",
              },
              popular_categories: "Popular categories",
              diversity_categories: "Diversity categories",
              filters: {
                toggle_filters_button: "Filters",
                clear: "Clear",
                sort_options: {
                  label: "Sort by",
                  newest: "Newest",
                  best_match: "Best match",
                  most_popular: "Most popular",
                  random: "Random",
                },
                orientation: {
                  label: "Orientation",
                  horizontal: "Horizontal",
                  vertical: "Vertical",
                  square: "Square",
                  panoramic_horizontal: "Panoramic horizontal",
                  panoramic_vertical: "Panoramic vertical",
                },
                number_of_people: {
                  label: "Number of People",
                  none: "None",
                  one: "One",
                  two: "Two",
                  group: "Group",
                },
                license: {
                  label: "License Type",
                  all: "All",
                  creative: "Creative",
                  editorial: "Editorial",
                },
                colors: {
                  label: "Colors",
                },
                age_of_people: {
                  label: "Age",
                  baby: "Baby",
                  child: "Child",
                  teenager: "Teenager",
                  young_adult: "Young adult",
                  adult: "Adult",
                  adults_only: "Adults only",
                  mature_adult: "Mature adult",
                  senior_adult: "Senior adult",
                },
                ethnicity: {
                  label: "Ethnicity",
                  black: "Black",
                  caucasian: "Caucasian",
                  east_asian: "East Asian",
                  hispanic_latino: "Hispanic/LatinX",
                  middle_eastern: "Middle Eastern",
                  mixed_race_person: "Mixed Race Person",
                  multiethnic_group: "Multi-Ethnic gGroup",
                  native_american_first_nations:
                    "Native American/First Nations",
                  pacific_islander: "Pacific Islander",
                  south_asian: "South Asian",
                  southeast_asian: "Southeast Asian",
                },
                resolution: {
                  label: "Resolution",
                },
                duration: {
                  label: "Duration",
                },
                more: {
                  label: "More",
                  safe: "Safe (Exclude nudity)",
                },
                summary: {
                  label: "Filters",
                  color: "color: {{color}}",
                  license_type: {
                    all: "All types",
                    creative: "Creative",
                    editorial: "Editorial",
                  },
                  number_of_people: {
                    none: "Without people",
                    one: "With one person",
                    two: "With two people",
                    group: "With group people",
                  },
                  orientations: {
                    horizontal: "Horizontal",
                    vertical: "Vertical",
                    square: "Square",
                    panoramic_horizontal: "Panoramic horizontal",
                    panoramic_vertical: "Panoramic vertical",
                  },
                  age_of_people: {
                    baby: "Baby",
                    child: "Child",
                    teenager: "Teenager",
                    young_adult: "Young adult",
                    adult: "Adult",
                    adults_only: "Adults only",
                    mature_adult: "Mature adult",
                    senior_adult: "Senior adult",
                  },
                  exclude_nudity: "Safe (Exclude nudity)",
                },
              },
              purchase: {
                select_plan: "Select Plan",
                select_format: "Select Format & Size",
                manage_plans: "Manage Plans",
                format: "Select Format & Size",
                credit: "Credit",
                credits: "Credits",
                istock_photo_id: "IStock photo ID",
                istock_video_id: "IStock video ID",
                plan_exceeded: "Plan Exceeded",
                size: {
                  small: "Small",
                  medium: "Medium",
                  large: "Large",
                  x_large: "X Large",
                  xx_large: "XX Large",
                  vector: "Vector",
                },
                credits_remaining: "credits remainings",
                media_type_not_included:
                  "Your current plan does not include this {{mediaType}}",
                images: "images",
                videos: "videos",
                days_left: "days left",
                credits_balance_too_small: "Your credits balance is too small",
                collection: "Collection",
                cost: "Cost",
              },
              buttons: {
                next: "Next",
                upload: "Upload",
                purchase: "Purchase",
              },
            },
            unsplash: {
              no_auth_title: "Access millions of images from Unsplash.",
              no_auth_action: "Connect to Unsplash",
              no_auth_statement:
                "Beautiful, free images and photos that you can download and use for any project. Better than any royalty free or stock photos.",
              select: "Select",
              popular_categories: "Popular categories",
              editorial: "Editorial",
              filters: {
                toggle_filters_button: "Filters",
                clear: "Clear",
                sort_options: {
                  label: "Sort by",
                  latest: "Latest",
                  oldest: "Oldest",
                  relevant: "Relevant",
                  popular: "Popular",
                },
                orientation: {
                  label: "Orientation",
                  portrait: "Portrait",
                  landscape: "Landscape",
                  squarish: "Squarish",
                },
                categories: {
                  label: "Categories",
                },
                license: {
                  label: "License Type",
                  creative: "Creative",
                  editorial: "Editorial",
                },
                colors: {
                  label: "Colors",
                },
                summary: {
                  label: "Filters",
                  color: "Color: {{color}}",
                },
                filters_in: "in",
                color_types: {
                  tones: "Tones",
                  black_and_white: "Black and white",
                },
              },
              summary: {
                description: "Description",
                permission: "Permission",
                free_to_use: "Free to use",
                published_at: "Published at",
                location: "Location",
                credit: "Credit",
                format: "Select Format & Size",
                size: {
                  small: "Small",
                  medium: "Medium",
                  large: "Large",
                  original_size: "Original size",
                },
              },
              colors: {
                orange: "Orange",
                red: "Red",
                yellow: "Yellow",
                green: "Green",
                teal: "Teal",
                blue: "Blue",
                purple: "Purple",
                magenta: "Magenta",
                white: "White",
                black: "Black",
                black_and_white: "Black and white",
              },
            },
            url: {
              inner_title: "Public URL of file to upload:",
              input_placeholder:
                "http://remote.site.example/images/remote-image.jpg",
            },
            metadataPage: {
              title: "Structured Metadata Values",
              subtitle: "1 asset selected",
              subtitle_plural: "{{count}} assets selected",
              tooltip:
                "Some required metadata fields are not set or the supplied values are invalid.",
              upload: "Upload",
              conflict_label: "Overwrite",
              intro: {
                openingText:
                  "You can fill in the following fields to add new metadata to your assets on upload.",
                conflictWarning:
                  "Note: Select ‘Overwrite’ for the fields where you want to apply the new values to both new and replaced assets.",
                closingText:
                  "After upload, you can modify metadata for individual assets from the Media Library.",
              },
              closePrompt:
                "Are you sure you want to close this dialog box? Your files will not be uploaded.",
              backPrompt:
                "Are you sure? Your file selection and the metadata values you entered will be lost.",
              approveCancel: "Yes",
              cancel: "Cancel",
              validationErrors: {
                string: {
                  min: "Must be at least {{min}} characters.",
                  max: "Can't be more than {{max}} characters.",
                  minAndMax: "Must be between {{min}}-{{max}} characters long.",
                  regex: "Must include only XXXX.",
                },
                integer: {
                  lessThan: "Must be less than {{less}}.",
                  lessThanEqual: "Can't be more than {{max}}.",
                  greaterThan: "Must be more than {{more}}.",
                  greaterThanEqual: "Must be at least {{min}}.",
                },
                number: {
                  lessThan: "Must be less than {{less}}.",
                  lessThanEqual: "Can't be more than {{max}}.",
                  greaterThan: "Must be more than {{more}}.",
                  greaterThanEqual: "Must be at least {{min}}.",
                },
                enum: {
                  oneOf:
                    "{{originalValue}} needs to be one of the specified options above.",
                },
                set: {
                  oneOf:
                    "{{originalValue}} needs to be one of the specified options above.",
                },
                date: {
                  lessThan: "Must be before {{max}}.",
                  lessThanEqual: "Can’t be after {{max}}.",
                  greaterThan: "Must be after {{min}}.",
                  greaterThanEqual: "Can’t be before {{min}}.",
                },
                stringError: "Must be text.",
                numberError: "Must be a number.",
                integerError: "Must be a number.",
                dateError: "Must be a date.",
                enumError: "Choose one of the specified options.",
                setError: "Choose at least one of the specified options.",
                required: "This field is required.",
                integerTypeError: "This is an integer field.",
                digitsLimitError:
                  "This number cannot be more than 16 digits long.",
                unsupportedFields:
                  "Please contact your administrator, there is a problem with the following optional metadata fields: ",
                unsupportedRequiredFields:
                  "Please contact your administrator, there is a problem with the following mandatory metadata fields: ",
              },
            },
          },
          fr: {
            or: "Ou",
            back: "Retour",
            advanced: "Avancé",
            close: "Fermer",
            no_results: "Aucun résultat",
            search_placeholder: "Rechercher des fichiers",
            about_uw: "À propos du widget de téléchargement",
            search: {
              placeholder: "Rechercher...",
              reset: "Réinitialiser la recherche",
            },
            menu: {
              files: "Mes fichiers",
              web: "Adresse Web",
              camera: "Caméra",
              gsearch: "Recherche d'image",
              gdrive: "Google Drive",
              dropbox: "Dropbox",
              facebook: "Facebook",
              instagram: "Instagram",
              shutterstock: "Shutterstock",
              getty: "gettyimages",
              istock: "iStock",
              unsplash: "Unsplash",
            },
            selection_counter: {
              selected: "Sélectionné",
            },
            actions: {
              upload: "Télécharger",
              next: "Suivant",
              clear_all: "Tout effacer",
              log_out: "Se déconnecter",
            },
            notifications: {
              general_error: "Une erreur est survenue.",
              general_prompt: "Êtes-vous sûr ?",
              limit_reached: "Plus aucun fichier ne peut être sélectionné.",
              invalid_add_url: "L'URL doit être valide.",
              invalid_public_id:
                "L'ID public ne peut pas contenir \\,,&,#,%,<,>.",
              no_new_files: "Les fichiers ont déjà été téléchargés.",
              image_purchased: "Image achetée",
              video_purchased: "Vidéo achetée",
              purchase_failed: "Échec de l'achat. Veuillez réessayer.",
              service_logged_out: "Déconnexion du service suite à une erreur",
              great: "Super",
              image_acquired: "Image acquise",
              video_acquired: "Vidéo acquise",
              acquisition_failed: "Échec de l'acquisition. Veuillez réessayer.",
            },
            advanced_options: {
              public_id_ph: "Identifiant public",
              tags_ph: "Ajouter un tag",
              add_new: "Ajouter un nouveau tag :",
              upload_preset_placeholder: "Préréglage de téléversement",
              upload_preset_no_options: "Aucun préréglage de téléversement",
            },
            landscape_overlay: {
              title: "Le mode paysage n'est pas pris en charge",
              description:
                "Basculez votre appareil en mode portrait pour continuer.",
            },
            aria_label: {
              close: "Fermer",
              back: "Retour",
            },
            queue: {
              title: "File d'attente de téléversement",
              title_uploading_with_counter:
                "Téléversement de {{num}} éléments en cours",
              title_processing_with_counter:
                "Traitement de {{num}} éléments en cours",
              title_uploading_processing_with_counters:
                "Téléversement de {{uploading}} éléments en cours, traitement de {{processing}} éléments en cours",
              title_uploading: "Téléversement des éléments en cours",
              mini_title: "Téléversé",
              mini_title_uploading: "En cours de téléversement",
              mini_title_processing: "En cours de traitement",
              show_completed: "Afficher les éléments terminés",
              retry_failed: "Réessayer les éléments échoués",
              abort_all: "Annuler tous",
              upload_more: "Téléverser plus",
              done: "Terminé",
              mini_upload_count: "{{num}} téléversés",
              mini_failed: "{{num}} échoués",
              statuses: {
                uploading: "Téléversement en cours...",
                processing: "Traitement en cours...",
                timeout:
                  "Un fichier volumineux est actuellement en cours de téléversement. Il pourrait mettre un certain temps à apparaître dans votre environnement de production.",
                error: "Erreur",
                uploaded: "Terminé",
                aborted: "Annulé",
              },
            },
            uploader: {
              filesize: {
                na: "N/D",
                b: "{{size}} Octets",
                k: "{{size}} Ko",
                m: "{{size}} Mo",
                g: "{{size}} Go",
                t: "{{size}} To",
              },
              errors: {
                file_too_large:
                  "La taille du fichier ({{size}}) dépasse la taille maximale autorisée ({{allowed}})",
                max_dimensions_validation:
                  "Les dimensions de l'image ({{width}}X{{height}}) sont plus grandes que le maximum autorisé : ({{maxWidth}}X{{maxHeight}})",
                min_dimensions_validation:
                  "Les dimensions de l'image ({{width}}X{{height}}) sont plus petites que le minimum requis : ({{minWidth}}X{{minHeight}})",
                unavailable: "N/D",
                max_number_of_files: "Nombre maximal de fichiers dépassé",
                allowed_formats: "Format de fichier non autorisé",
                max_file_size: "Le fichier est trop volumineux",
                min_file_size: "Le fichier est trop petit",
              },
              close_mid_upload:
                "Des téléversements sont en cours. Cliquez sur OK pour annuler.",
            },
            crop: {
              title: "Recadrer",
              crop_btn: "Recadrer",
              skip_btn: "Passer",
              reset_btn: "Réinitialiser",
              close_btn: "Oui",
              close_prompt:
                "La fermeture annulera tous les téléversements en cours. Êtes-vous sûr(e) ?",
              image_error: "Erreur lors du chargement de l'image",
              image_data_error:
                "soit la taille du fichier dépasse la limite du navigateur, soit le fichier est peut-être corrompu.",
              corner_tooltip: "Faites glisser le coin pour redimensionner",
              handle_tooltip: "Faites glisser la poignée pour redimensionner",
            },
            camera: {
              capture: "Capturer",
              cancel: "Annuler",
              take_pic: "Prenez une photo et téléversez-la",
              explanation:
                "Assurez-vous que votre appareil photo est connecté et que votre navigateur autorise la capture. Lorsque vous êtes prêt(e), cliquez sur Capturer.",
              camera_error: "Impossible d'accéder à l'appareil photo",
              retry: "Réessayer l'appareil photo",
              file_name: "Appareil_photo_{{time}}",
            },
            dropbox: {
              no_auth_title:
                "Téléversez des fichiers depuis votre compte Dropbox.",
              no_auth_action: "Connectez-vous à Dropbox",
              no_photos: "Aucune photo",
              no_files: "Aucun fichier",
              root_crumb: "Racine",
              list_headers: {
                select: "Sélectionner",
                name: "Nom",
                modified: "Modifié",
              },
              menu: {
                browse: "Parcourir",
                recent: "Récent",
              },
              authenticating: "Authentification en cours...",
            },
            facebook: {
              no_photos: "Aucune photo...",
              no_auth_title:
                "Téléversez des fichiers depuis votre compte Facebook.",
              no_auth_action: "Connectez-vous à Facebook",
              no_auth_statement:
                "Nous ne publierons rien sans votre permission.",
              album_subtitle: "{{count}} photos",
              menu: {
                uploaded: "Vos photos",
                tagged: "Photos de vous",
                albums: "Albums",
              },
            },
            google_drive: {
              no_auth_title:
                "Téléversez des fichiers depuis votre Google Drive.",
              no_auth_action: "Connectez-vous à Google Drive",
              search: {
                placeholder: "Rechercher...",
                reset: "Réinitialiser la recherche",
              },
              grid: {
                folders: "Dossiers",
                files: "Fichiers",
                empty_folder: "Ce dossier est vide.",
              },
              recent: "Récent",
              starred: "Favoris",
              my_drive: "Mon Drive",
              shared_drive: "Drives partagés",
              search_results: "Résultats de recherche",
              shared_with_me: "Partagé avec moi",
              name: "Nom",
              modifiedTime: "Dernière modification",
              modifiedByMeTime: "Dernière modification par moi",
              viewedByMeTime: "Dernière ouverture par moi",
              notifications: {
                retrieve_failed:
                  "Impossible de récupérer les données de téléversement depuis Google Drive.",
              },
            },
            image_search: {
              main_title: "Recherche d'images",
              inputPlaceholder: "Rechercher des images",
              customPlaceholder: "Rechercher sur {{site}}",
              show_options: "Afficher les options",
              hide_options: "Masquer les options",
              filters_title: "Site",
              all: "tous",
              rights: "Droits d'utilisation :",
              rights_options: {
                not_filtered: "non filtré par licence",
                free: "libre d'utilisation ou de partage",
                free_com:
                  "libre d'utilisation ou de partage, même commercialement",
                free_mod: "libre d'utilisation, de partage ou de modification",
                free_mod_com:
                  "libre d'utilisation, de partage ou de modification, même commercialement",
              },
              search_error: "La recherche a échoué, veuillez réessayer.",
            },
            instagram: {
              no_auth_title:
                "Téléversez des photos depuis votre compte Instagram.",
              no_auth_action: "Connectez-vous à Instagram",
              header_title: "Vos dernières photos Instagram",
              authenticating: "Authentification en cours...",
            },
            local: {
              browse: "Parcourir",
              dd_title_single: "Glissez et déposez un élément ici",
              dd_title_multi: "Glissez et déposez des éléments ici",
              drop_title_single: "Déposez un fichier à téléverser",
              drop_title_multiple: "Déposez des fichiers à téléverser",
            },
            url: {
              inner_title: "URL public du fichier à téléverser :",
              input_placeholder:
                "http://site.distance.exemple/images/image-distant.jpg",
            },
            metadataPage: {
              title: "Valeurs de métadonnées structurées",
              subtitle: "1 élément sélectionné",
              subtitle_plural: "{{count}} éléments sélectionnés",
              tooltip:
                "Certains champs de métadonnées requis ne sont pas définis ou les valeurs fournies sont invalides.",
              upload: "Téléverser",
              conflict_label: "Écraser",
              intro: {
                openingText:
                  "Vous pouvez remplir les champs suivants pour ajouter de nouvelles métadonnées à vos éléments lors du téléversement.",
                conflictWarning:
                  "Remarque : Sélectionnez 'Écraser' pour les champs où vous souhaitez appliquer les nouvelles valeurs à la fois aux nouveaux éléments et aux éléments remplacés.",
                closingText:
                  "Après le téléversement, vous pouvez modifier les métadonnées pour des éléments individuels depuis la bibliothèque multimédia.",
              },
              closePrompt:
                "Êtes-vous sûr(e) de vouloir fermer cette boîte de dialogue ? Vos fichiers ne seront pas téléversés.",
              backPrompt:
                "Êtes-vous sûr(e) ? Votre sélection de fichiers et les valeurs de métadonnées que vous avez entrées seront perdues.",
              approveCancel: "Oui",
              cancel: "Annuler",
              validationErrors: {
                string: {
                  min: "Doit comporter au moins {{min}} caractères.",
                  max: "Ne peut pas comporter plus de {{max}} caractères.",
                  minAndMax:
                    "Doit comporter entre {{min}} et {{max}} caractères.",
                  regex: "Ne doit inclure que XXXX.",
                },
                integer: {
                  lessThan: "Doit être inférieur à {{less}}.",
                  lessThanEqual: "Ne peut pas être supérieur à {{max}}.",
                  greaterThan: "Doit être supérieur à {{more}}.",
                  greaterThanEqual: "Doit être au moins égal à {{min}}.",
                },
                number: {
                  lessThan: "Doit être inférieur à {{less}}.",
                  lessThanEqual: "Ne peut pas être supérieur à {{max}}.",
                  greaterThan: "Doit être supérieur à {{more}}.",
                  greaterThanEqual: "Doit être au moins égal à {{min}}.",
                },
                enum: {
                  oneOf:
                    "{{originalValue}} doit être l'une des options spécifiées ci-dessus.",
                },
                set: {
                  oneOf:
                    "{{originalValue}} doit être l'une des options spécifiées ci-dessus.",
                },
                date: {
                  lessThan: "Doit être antérieur à {{max}}.",
                  lessThanEqual: "Ne peut pas être postérieur à {{max}}.",
                  greaterThan: "Doit être postérieur à {{min}}.",
                  greaterThanEqual: "Ne peut pas être antérieur à {{min}}.",
                },
                stringError: "Doit être un texte.",
                numberError: "Doit être un nombre.",
                integerError: "Doit être un nombre.",
                dateError: "Doit être une date.",
                enumError: "Choisissez l'une des options spécifiées.",
                setError: "Choisissez au moins l'une des options spécifiées.",
                required: "Ce champ est requis.",
                integerTypeError: "Il s'agit d'un champ entier.",
                digitsLimitError:
                  "Ce nombre ne peut pas comporter plus de 16 chiffres.",
                unsupportedFields:
                  "Veuillez contacter votre administrateur, il y a un problème avec les champs de métadonnées facultatifs suivants : ",
                unsupportedRequiredFields:
                  "Veuillez contacter votre administrateur, il y a un problème avec les champs de métadonnées obligatoires suivants : ",
              },
            },
          },
        },
      }}
      onSuccess={(result, { widget }) => {
        //@ts-ignore
        onImageUpload(result.info.public_id);
        widget.close();
      }}
    >
      {({ open }) => {
        return (
          <FullButton customStyles={{ width: "100%" }} onClick={() => open()}>
            {t("common.importImage")}
          </FullButton>
        );
      }}
    </CldUploadWidget>
  );
};

export default ImageUpload;
