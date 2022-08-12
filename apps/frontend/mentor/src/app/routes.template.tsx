import { MentorDashboardLayout } from 'MentorDashboardLayout'; 
import { MentorCourseDetailsLayout } from 'CourseDetailsLayout'; 
import { MentorCreateCourseLayout } from 'MentorCreateCourseLayout'; 
import { MentorProfileLayout } from 'MentorProfileLayout'; 

import { Route, Routes } from "react-router-dom";

const RenderRoutes = () => {
  return (
    <Routes>
      			<Route path="/dashboard" element={<MentorDashboardLayout />} />

			<Route path="/course" element={<MentorCourseDetailsLayout />} />

			<Route path="/createcourse" element={<MentorCreateCourseLayout />} />

			<Route path="/profile" element={<MentorProfileLayout />} />


    </Routes>
  );
};

export default RenderRoutes;
